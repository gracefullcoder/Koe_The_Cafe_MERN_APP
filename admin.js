const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require("path");
const methodOverride = require("method-override");

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const PORT = process.env.PORT || 8080;
const connectDB = require('./config/dbconfig.js');

//routes
const homeRouter = require("./routes/homepageroute.js");
const adminRouter = require("./routes/adminroutes.js");
const herosectionRouter = require("./routes/herosectionroutes.js");
const specialitysectionRouter = require("./routes/specialitysectionroutes.js");
const countdownRouter = require('./routes/countdownroute.js');
const eventsectionRouter = require("./routes/eventsectionroute.js");
const testimonialsectionRouter = require('./routes/testtimonialsectionroute.js');
const bookingsRouter = require("./routes/bookingsroute.js");
const workshopRouter = require("./routes/workshoproute.js");

//config database
connectDB;


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));


app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/admin`);
});


app.use("/",homeRouter);

app.use("/admin", adminRouter);

app.use("/admin/herosection", herosectionRouter);

app.use("/admin/specialitysection", specialitysectionRouter);

app.use("/admin/countdownsection", countdownRouter);

app.use("/admin/eventsection", eventsectionRouter);

app.use("/admin/testimonialsection", testimonialsectionRouter);

app.use("/admin/bookings", bookingsRouter);

app.use("/admin/workshop", workshopRouter);