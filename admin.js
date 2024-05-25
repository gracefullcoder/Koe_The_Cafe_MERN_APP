const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require("path");
const methodOverride = require("method-override");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const User = require("./models/user.js");
const { isAdmin } = require("./middlewares/adminmiddlewares.js");
const PORT = process.env.PORT || 8080;
const connectDB = require('./config/dbconfig.js');

//routes
const homeRouter = require("./routes/homepageroute.js");
const adminRouter = require("./routes/adminroutes.js");
const herosectionRouter = require("./routes/herosectionroutes.js");
const specialitysectionRouter = require("./routes/specialitysectionroutes.js");
const workshopRouter = require('./routes/workshoproutes.js');
const eventsectionRouter = require("./routes/eventsectionroute.js");
const testimonialsectionRouter = require('./routes/testtimonialsectionroute.js');
const bookingsRouter = require("./routes/bookingsroute.js");
const registrationRouter = require("./routes/registrationroute.js");
const authRouter = require("./routes/userauthenticationroute.js");

const { ExpressError } = require('./utils/wrapAsyncAndExpressError.js');
const { error } = require('console');

//config database
connectDB;


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//authentication
const sessionStorage = MongoStore.create({
  mongoUrl: process.env.MONGO_ATLAS_URL,
  crypto: {
    secret: process.env.SESSION_SECRETKEY
  },
  touchAfter: 24 * 3600 //if no interaction with server then touch after 1 day
});

sessionStorage.on("error",() => {
  console.log("ERROR Due to mongo session store",err);
});

const session_options = {
  store: sessionStorage,
  secret: process.env.SESSION_SECRETKEY,
  resave: false,
  saveUninitialized: true,
  cookie: { // using cookie option bcoz expiry default value is for session,so to keep user logged in
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
};

app.use(session(session_options));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  let user = await User.findById(id); //need to change it because mongoose abb findById mai callback nahi leta
  done(null, user);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


app.use("/", homeRouter);

app.use("/auth", authRouter);

app.use("/admin", isAdmin, adminRouter);

app.use("/admin/herosection", isAdmin, herosectionRouter);

app.use("/admin/specialitysection", isAdmin, specialitysectionRouter);

app.use("/admin/workshopsection", isAdmin, workshopRouter);

app.use("/admin/eventsection", isAdmin, eventsectionRouter);

app.use("/admin/testimonialsection", isAdmin, testimonialsectionRouter);

app.use("/admin/bookings", isAdmin, bookingsRouter);

app.use("/admin/workshopregistration", isAdmin, registrationRouter);

//error Handling if page not found
// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page not Found"));
// })

//Error handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  let { status = 500, message = "Something Went Wrong" } = err;
  res.status(status).send(message);
})

