const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require("path");
const methodOverride = require("method-override");
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oidc');
const MongoStore = require('connect-mongo');
const { createServer } = require('node:http');
const server = createServer(app);
const { Server } = require('socket.io');

//models and middleware
const User = require("./models/user.js");
const { isAdmin } = require("./middlewares/adminmiddlewares.js");
const { isLogedIn } = require("./middlewares/authmiddlewares.js");

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const PORT = process.env.PORT || 8080;


//utils and config
const {ExpressError} = require("./utils/wrapAsyncAndExpressError.js")
const connectDB = require('./config/dbconfig.js');


//config database
connectDB;

//routes
const homeRouter = require("./routes/homepageroute.js");
const adminRouter = require("./routes/userroutes.js");
const herosectionRouter = require("./routes/herosectionroutes.js");
const specialitysectionRouter = require("./routes/specialitysectionroutes.js");
const workshopRouter = require('./routes/workshoproutes.js');
const eventsectionRouter = require("./routes/eventsectionroute.js");
const testimonialsectionRouter = require('./routes/testtimonialsectionroute.js');
const bookingsRouter = require("./routes/bookingsroute.js");
const registrationRouter = require("./routes/registrationroute.js");
const authRouter = require("./routes/userauthenticationroute.js");
const notificationRouter = require("./routes/NotificationsRoutes.js");
const menuSectionRouter = require("./routes/menuSectionRoutes.js");
const cartRouter = require("./routes/cartroute.js");
const orderRouter = require("./routes/orderroutes.js");
const trafficRouter = require("./routes/trafficroutes.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.set("trust proxy", 1);

app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const cors = require('cors')

const corsOptions = {
  origin: process.env.FRONTEND_DOMAIN,
  methods: ["GET","PATCH","PUT","DELETE","POST"],
  optionsSuccessStatus: 200,
  credentials: true
}

app.use(cors(corsOptions));


//session storage with mongostore
const sessionStorage = MongoStore.create({
  mongoUrl: process.env.MONGO_ATLAS_URL,
  crypto: {
    secret: process.env.SESSION_SECRETKEY
  },
  touchAfter: 24 * 3600
});

sessionStorage.on("error", (err) => {
  console.log("ERROR Due to mongo session store", err);
});

const session_options = {
  store: sessionStorage,
  secret: process.env.SESSION_SECRETKEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None' 
  }
};

app.use(session(session_options));

//passport serialize deserialize and authentication
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  let user = await User.findById(id);
  done(null, user);
});


//local strategy
passport.use(new LocalStrategy(User.authenticate()));

//google strategy
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.AUTH_REDIRECT_URI,
  passReqToCallback: true,
},
  async function verify(req, issuer, profile, cb) {
    try {
      console.log(profile);
      let existingUser = await User.findOne({ username: profile.emails[0].value })
      console.log(existingUser);
      console.log(req.session);
      if (!existingUser) {

        if (!req.session.isFormFilled) {
          return cb(null, false, { message: 'form_incomplete' });
        }

        let newCred = new User({
          federatedCredentials: {
            provider: issuer,
            subject: profile.id
          },
          fullname: profile.displayName,
          username: profile.emails[0].value,
          gender: req.session.gender,
          DOB: req.session.DOB,
          profilepicture: req.session.profilepicture
        });

        await newCred.save();
        req.session.isNew = true;
        return cb(null, newCred);
      }

      else {
        return cb(null, existingUser);
      }
    } catch (err) {
      console.log("error aaaya");
      return cb(err);
    }
  }
));


server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//sockets code
const Booking = require('./models/booking.js');
const orderIdToSocket = new Map();

const io = new Server(server, {
  cors: corsOptions
})

app.set('socket.io', io);

const seatTracking = new Map();

async function setOverlappingBookings(slotDetails) {
  const parseTime = (time) => {
    return { hrs: parseInt(time.slice(0, 2)), minutes: parseInt(time.slice(3, 5)) };
  }

  const userStartTime = parseTime(slotDetails.startTime);
  const userEndTime = parseTime(slotDetails.endTime);

  let bookings = await Booking.find({ date: slotDetails.date });

  const timeInterval = (userTime, bookedTime) => {
    if (userTime.hrs != bookedTime.hrs) return (userTime.hrs > bookedTime.hrs ? true : false);
    return (userTime.minutes >= bookedTime.minutes ? true : false);
  }

  console.log(bookings, slotDetails);

  const bookedSeats = bookings.map((booking) => {

    const bookedStartTime = parseTime(booking.startTime);
    const bookedEndTime = parseTime(booking.endTime);


    if (!(timeInterval(userStartTime, bookedStartTime) && timeInterval(userStartTime, bookedEndTime))) {
      return booking;
    }

    if (!(timeInterval(bookedStartTime, userStartTime) && timeInterval(bookedStartTime, userEndTime))) {
      return booking;
    }

  })
  console.log(bookedSeats);

  const newSeatMapping = new Map();
  bookedSeats.forEach((booking) => {
    booking.seats.forEach((seat) => {
      newSeatMapping.set(seat, "booked");
    })
  })
  console.log("i m the new", newSeatMapping);
  return newSeatMapping;
}

io.on("connection", (socket) => {
  let timeOver = null;

  socket.on("get-reservation", async (slotDetails) => {
    const seatMapping = await setOverlappingBookings(slotDetails);
    socket.emit("seats-layout", [...seatMapping]);
    console.log("recieved client send matrix");
    timeOver = setTimeout(() => {
      socket.emit("disconnect-user")
    }, 100000);
  })

  socket.on("remove-selected-seats", ({ selectedSeats, userId, slotDetails }) => {
    console.log("here", selectedSeats);
    socket.broadcast.emit("seats-updated", { seatKey: selectedSeats, userId, slotDetails, status: "disconnected" })
  })

  socket.on("seat-selected", ({ seatKey, userId, slotDetails }) => {
    console.log("seatselected", seatKey);

    io.emit("seats-updated", { seatKey, status: "added", user: userId, slotDetails });
  })

  socket.on("seat-removed", ({ seatKey, userId, slotDetails }) => {
    io.emit("seats-updated", { seatKey, status: "removed", user: userId, slotDetails });
  })

  socket.on("seat-booked", async ({ selectedSeats, userId, slotDetails }) => {
    const bookingData = {};

    selectedSeats.forEach((seat) => {
      seatTracking.set(seat, "booked");
      const table = "table".concat(seat[0].charCodeAt(0) - 64);
      bookingData[`${table}.${seat}`] = userId;
    })
    console.log(bookingData);
    clearTimeout(timeOver);
    io.emit("seat-confirmed", { selectedSeats, user: userId, slotDetails });
  })

  socket.on("my-orders", (orderIds) => {
    const socketId = socket.id;
    orderIds.forEach((id) => orderIdToSocket.set(id, socketId));
    console.log(orderIdToSocket);
  })

  socket.on("order-updated", (data) => {
    console.log("order updated");
    const socketId = orderIdToSocket.get(data.orderId);
    io.to(socketId).emit("updated-status", data);
  })

  socket.on("remove-orders", (orderIds, callback) => {
    orderIds.forEach(orderId => {
      orderIdToSocket.delete(orderId);
    })
    console.log(orderIds, " remove then => upadted socket to orderid map map ", orderIdToSocket);
    callback();
  })

  socket.on("disconnect", () => {
    console.log("User with socket ", socket.id, " got disconected")
  })
})

//apis
app.use("/", homeRouter);

app.use("/auth", authRouter);

app.use("/traffic", trafficRouter);

app.use("/cart", isLogedIn, cartRouter);

app.use("/order", isLogedIn, orderRouter);

app.use("/admin", isAdmin, adminRouter);

app.use("/admin/herosection", isAdmin, herosectionRouter);

app.use("/admin/menusection", isAdmin, menuSectionRouter);

app.use("/admin/specialitysection", isAdmin, specialitysectionRouter);

app.use("/admin/workshopsection", isAdmin, workshopRouter);

app.use("/admin/eventsection", isAdmin, eventsectionRouter);

app.use("/admin/testimonialsection", isAdmin, testimonialsectionRouter);

app.use("/admin/bookings", isAdmin, bookingsRouter);

app.use("/admin/workshopregistration", isAdmin, registrationRouter);

app.use("/admin/notification", isAdmin, notificationRouter);


//error Handling if page not found
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found"));
})

//Error handling middleware
app.use((err, req, res, next) => {
  console.log(err, "i m in");
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  console.log(statusCode, message);
  res.status(statusCode).json({ success: false, message: message });
})

