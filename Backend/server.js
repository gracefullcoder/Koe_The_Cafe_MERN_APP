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
const pushNotificationRoter = require("./routes/pushnotificationroute.js");


app.set("trust proxy", 1);

app.use(bodyParser.json());

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
    // sameSite: 'None'
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

const io = new Server(server, {
  cors: corsOptions
})
const socketConnections = require("./socket.js");
socketConnections(io);
app.set('socket.io', io);

//apis
app.use("/", homeRouter);

app.use("/auth", authRouter);

app.use("/traffic", trafficRouter);

app.use("/cart", isLogedIn, cartRouter);

app.use("/order", isLogedIn, orderRouter);

app.use("/admin", isAdmin, adminRouter);

app.use("/pushnotification",isLogedIn,pushNotificationRoter);

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

