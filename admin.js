const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const PORT = process.env.PORT || 8080;
const Countdown = require("./models/countdown.js");
const Event = require("./models/events.js");
const Testimonial = require("./models/testimonials.js");
const Booking = require("./models/booking.js");
const Workshop = require("./models/workshop.js");
const multer = require('multer');
const connectDB = require('./config/dbconfig.js');

//routes
const adminRouter = require("./routes/adminroutes.js");
const herosectionRouter = require("./routes/herosectionroutes.js");
const countdownRouter = require('./routes/countdownroute.js');
const eventsectionRouter = require("./routes/eventsectionroute.js");

connectDB;


//storage has 2 functions destination: kaha pai upload karna hai and fileName: what to set
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })

const ImageKit = require("imagekit");
const fs = require('fs');


const imagekit = new ImageKit({
  publicKey: "public_W8TYxH4QXoUCiGDLGtP4HBEpjFc=",
  privateKey: "private_QlHFE1GFwoAhSJB1qPJB0FiocTc=",
  urlEndpoint: "https://ik.imagekit.io/vaibhav11"
});



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));


app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/admin`);
});


//section page
app.use("/admin",adminRouter);

//herosection starts here
app.use("/admin/herosection",herosectionRouter);
//herosection ends here


//speciality section
app.use("/admin/specialitysection",herosectionRouter);
//speciality section ends here


//countdown section starts here

app.use("/admin/countdownsection",countdownRouter);

//countdown section ensd here

//event section starts here

app.use("/admin/eventsection",eventsectionRouter);

//events route ends here

//testimonials section starts here


//get request on testimonials
app.get("/testimonials", async (req, res) => {
  let testimonials = await Testimonial.find();
  res.render("testimonials.ejs", { testimonials });
})

//post request on testimonials
app.post("/testimonials",upload.single('myFile'), async (req, res) => {
  let { name, review} = req.body;
  name = name.toString();
  review = review.toString();
  let myFile = req.file.originalname;
  let fileLocation = path.join("./uploads",myFile);
  fs.readFile(fileLocation, async (err, data) => {

    if (err) throw err; // Fail if the file can't be read.
    imagekit.upload({
      file: data, //required
      fileName: myFile, //required
    }, async function (error, result) {
      if (error) console.log(error);
      else {
        // console.log(result);
        let profilephoto = result.url;
        let imageid = result.fileId;
        let data = new Testimonial({ name: name, review: review, profilephoto: profilephoto, imageid: imageid })
        await data.save();
        console.log(data);
        fs.unlinkSync(fileLocation);
        res.redirect("/testimonials");
      }
    });
  });
})


//get request to edit testimonials section
app.get("/edittestimonial/:id", async (req, res) => {
  let { id } = req.params;
  id = id.toString();
  let data = await Testimonial.find({ _id: id });
  console.log(data);
  res.render("edittestimonials.ejs", { data });
})

//patch request on edittestimonials redirect to testimoniasl
app.patch("/edittestimonial/:id",upload.single('myFile'), async (req, res) => {
  let { id } = req.params;
  let { name, review,imagecheckbox} = req.body;
  name = name.toString();
  review = review.toString();

  console.log(req.body);

  if (!imagecheckbox) {
    let document = await Testimonial.findOneAndUpdate({ _id: id }, { name: name, review: review });
    res.redirect("/testimonials");
  }
  else {
    let myFile = req.file.originalname;
    let fileLocation = path.join("./uploads",myFile);
    fs.readFile(fileLocation, async (err, data) => {

      if (err) throw err;   // Fail if the file can't be read.
      imagekit.upload({
        file: data,   //required
        fileName: myFile,   //required
      },
        async function (error, result) {
          if (error) console.log(error);
          else {
            // console.log(result);
            let profilephoto = result.url;
            let imageid = result.fileId;
            let document = await Testimonial.findOneAndReplace({ _id: id }, { name: name, review: review, profilephoto: profilephoto, imageid: imageid });

            let oldimageid = document.imageid;

            imagekit.deleteFile(oldimageid)
              .then(response => {
                console.log(response);
              })
              .catch(error => {
                console.log(error);
              });
              fs.unlinkSync(fileLocation);
              res.redirect("/testimonials");
          }
        });
    });
  }

}
);

//delete request on testimonials page and again redirect to same page
app.delete("/testimonials/:id", async (req, res) => {
  let { id } = req.params;
  id = id.toString();
  let delData = await Testimonial.findByIdAndDelete(id);

  let imageid = delData.imageid;

  imagekit.deleteFile(imageid)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
  // console.log(id);
  res.redirect("/testimonials");
})

//testimonial section ends here



//booking section
app.get("/bookings", async (req, res) => {
  let bookings = await Booking.find();
  console.log(bookings);
  res.render("bookatable.ejs", { bookings })
})

app.delete("/bookings/:id", async (req, res) => {
  let { id } = req.params;
  id = id.toString();
  let document = await Booking.findByIdAndDelete(id);
  res.redirect("/bookings");
})

//boojing section ends here

//workshop section
app.get("/workshop", async (req, res) => {
  let registrations = await Workshop.find();
  console.log(registrations);
  res.render("workshopregistrations.ejs", { registrations })
})

app.delete("/workshop/:id", async (req, res) => {
  let { id } = req.params;
  id = id.toString();
  let document = await Workshop.findByIdAndDelete(id);
  res.redirect("/workshop");
})

//wrorksop section ends here


// app.post('/signup', async (req, res) => {
//   try {
//     const { n1, email } = req.body;
//     console.log(req.body);
//     const newCafe = new Cafe({ n1, email });
//     await newCafe.save();
//     res.sendFile(__dirname + '/index.html');
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });



//   app.post('/adm2', async (req, res) => {
//     if (req.body.n1 == 'akshat' && req.body.pass == 'cafe') {

//       console.log(req.body);
//       app.set('view engine', 'ejs');

//       Booking.find({}).then((m) => { res.render('loged2', { m }); });

//     } else {
//       res.send('<h1>incorrect</h1>');
//     }
// });

// app.post('/del', async (req, res) => {

//   await Cafe.deleteOne({ n1: req.body.n1 });

//   console.log(req.body);
//   await Cafe.find({}).then((x) => { res.render('loged', { x }); });

// });


// app.post('/book', async (req, res) => {
//   await Booking.deleteOne({ name: req.body.n1 });
//   console.log(req.body);
//   await Booking.find({}).then((m) => { res.render('loged2', { m }); });

// });

// app.post('/booking', async (req, res) => {
//   // const newCafe = new Cafe({ n1, email });
//   //   await newCafe.save();
//   const name = req.body.name;
//   const phone = req.body.phone;
//   const person = req.body.person[0];
//   const time = req.body.person[1];
//   const date = req.body.reservationdate;
//   const message = req.body.message;
//   const newbooking = new Booking({name,phone,person,date,time,message});
//   await newbooking.save();
//   console.log(req.body);
//   res.redirect("/");
// });










// const connectionString = 'mongodb://127.0.0.1:27017/Koe_The_Cafe';
// mongoose.connect(connectionString);
// mongodb+srv://adm:adm@akshatbhaika.ftmgts2.mongodb.net/
