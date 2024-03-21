const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const PORT = process.env.PORT || 8080;
const Heroslider = require("./models/herosection.js");
const Specialslider = require('./models/specialsection.js');
const Countdown = require("./models/countdown.js");
const Event = require("./models/events.js");
const Testimonial = require("./models/testimonials.js");
const Booking = require("./models/booking.js");
const Workshop = require("./models/workshop.js");

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


main()
  .then(() => {
    console.log("Connection was succesfull");
  })
  .catch(err => console.log(err));

async function main() {
  const connectionString = 'mongodb+srv://vaibhav:Svnit1103@koethecafe.8x5wmra.mongodb.net/';
  await mongoose.connect(connectionString);
}


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


//section page
app.get("/", async (req, res) => {
  res.render("select.ejs");
})

//select page se ispe post and it will redirect ot other pages
app.post("/", async (req, res) => {
  let { section } = req.body;
  section = section.toString().toLowerCase();

  // console.log(req.body);
  console.log(section);
  if (section == 'herosection') {
    res.redirect("/herosection");
  }
  else if (section == "specialitysection") {
    res.redirect("/specialsection");
  }
  else if (section == "countdownsection") {
    res.redirect("/countdownsection");
  }else if(section == "events"){
    res.redirect("/events");
  }
  else if (section == "testimonialssection") {
    res.redirect("/testimonials")
  }
  else if(section == "bookings"){
    res.redirect("/bookings");
  }
  else if(section == "workshop"){
    res.redirect("/workshop");
  }
});


//herosection starts here

//get request for herosection route
app.get("/herosection", async (req, res) => {
  let heroSliders = await Heroslider.find();
  res.render("herosection.ejs", { heroSliders });
})


//post request on herosection
app.post("/herosection", async (req, res) => {
  let { label, title, text, image, myFile } = req.body;
  label = label.toString();
  title = title.toString();
  text = text.toString();
  image = image.toString();
  myFile = myFile.toString();
  image = image + "/" + myFile;
  console.log(image);
  fs.readFile(image, async (err, data) => {

    if (err) throw err; // Fail if the file can't be read.
    imagekit.upload({
      file: data, //required
      fileName: myFile, //required
    }, async function (error, result) {
      if (error) console.log(error);
      else {
        // console.log(result);
        image = await result.url;
        let imageid = await result.fileId;
        let data = new Heroslider({ label: label, title: title, text: text, image: image, imageid: imageid })
        await data.save();
        console.log(data);
        res.redirect("/herosection");
      }
    });
  });

  // console.log(data);

})

//get request to edit hero section
app.get("/editHero/:id", async (req, res) => {
  let { id } = req.params;
  id = id.toString();
  let data = await Heroslider.find({ _id: id });
  console.log(data);
  res.render("editherosection.ejs", { data });
})

//patch request on herosection redirect to herosection
app.patch("/editHero/:id", async (req, res) => {
  let { id } = req.params;
  let { label, title, text, image, myFile } = req.body;
  label = label.toString();
  title = title.toString();
  text = text.toString();
  image = image.toString();
  myFile = myFile.toString();
  image = image + "/" + myFile;

  console.log(req.body);

  if (image == "/") {
    let document = await Heroslider.findOneAndUpdate({ _id: id }, { label: label, title: title, text: text });
  }
  else {
    fs.readFile(image, async (err, data) => {

      if (err) throw err;   // Fail if the file can't be read.
      imagekit.upload({
        file: data,   //required
        fileName: myFile,   //required
      },
        async function (error, result) {
          if (error) console.log(error);
          else {
            // console.log(result);
            image = result.url;
            let imageid = result.fileId;
            let document = await Heroslider.findOneAndReplace({ _id: id }, { label: label, title: title, text: text, image: image, imageid: imageid });

            let oldimageid = document.imageid;

            imagekit.deleteFile(oldimageid)
              .then(response => {
                console.log(response);
              })
              .catch(error => {
                console.log(error);
              });
          }
        });
    });
  }

  res.redirect("/herosection");
}
);

//delete request on herosection page and again redirect to same page
app.delete("/herosection/:id", async (req, res) => {
  let { id } = req.params;
  id = id.toString();
  let delData = await Heroslider.findByIdAndDelete(id);

  let imageid = delData.imageid;

  imagekit.deleteFile(imageid)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
  // console.log(id);
  res.redirect("/herosection");
})


//herosection ends here


//speciality section

app.get("/specialsection", async (req, res) => {
  let specialSliders = await Specialslider.find();
  // let heroSliders = await Heroslider.find();
  res.render("specialsection.ejs", { specialSliders });
})


//post request on herosection
app.post("/specialsection", async (req, res) => {
  let { label, title, text, image, myFile } = req.body;
  label = label.toString();
  title = title.toString();
  text = text.toString();
  image = image.toString();
  myFile = myFile.toString();
  image = image + "/" + myFile;
  // console.log(image);
  fs.readFile(image, async (err, data) => {

    if (err) throw err; // Fail if the file can't be read.
    imagekit.upload({
      file: data, //required
      fileName: myFile, //required
    }, async function (error, result) {
      if (error) console.log(error);
      else {
        // console.log(result);
        image = result.url;
        let imageid = result.fileId;
        let data = new Specialslider({ label: label, title: title, text: text, image: image, imageid: imageid })
        await data.save();
        console.log(data);
      }
    });
  });

  // console.log(data);

  res.redirect("/specialsection");
})


//get request to edit hero section
app.get("/editspecial/:id", async (req, res) => {
  let { id } = req.params;
  id = id.toString();
  let data = await Specialslider.find({ _id: id });
  console.log(data);
  res.render("editspecialsection.ejs", { data });
})

//patch request on herosection redirect to herosection
app.patch("/editspecialsection/:id", async (req, res) => {
  let { id } = req.params;
  let { label, title, text, image, myFile } = req.body;
  label = label.toString();
  title = title.toString();
  text = text.toString();
  image = image.toString();
  myFile = myFile.toString();
  image = image + "/" + myFile;

  console.log(req.body);

  if (image == "/") {
    let document = await Specialslider.findOneAndUpdate({ _id: id }, { label: label, title: title, text: text });
  }
  else {
    fs.readFile(image, async (err, data) => {

      if (err) throw err;   // Fail if the file can't be read.
      imagekit.upload({
        file: data,   //required
        fileName: myFile,   //required
      },
        async function (error, result) {
          if (error) console.log(error);
          else {
            // console.log(result);
            image = result.url;
            let imageid = result.fileId;
            let document = await Specialslider.findOneAndReplace({ _id: id }, { label: label, title: title, text: text, image: image, imageid: imageid });

            let oldimageid = document.imageid;

            imagekit.deleteFile(oldimageid)
              .then(response => {
                console.log(response);
              })
              .catch(error => {
                console.log(error);
              });
          }
        });
    });
  }

  res.redirect("/specialsection");
}
);

//delete request on herosection page and again redirect to same page
app.delete("/specialsection/:id", async (req, res) => {
  let { id } = req.params;
  id = id.toString();
  let delData = await Specialslider.findByIdAndDelete(id);

  let imageid = delData.imageid;

  imagekit.deleteFile(imageid)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
  // console.log(id);
  res.redirect("/specialsection");
})

//countdown section starts here

app.get("/countdownsection", async (req, res) => {
  let countdown = await Countdown.find();
  console.log(countdown);
  res.render("countdownsection.ejs", { countdown })
})


app.patch("/countdownsection/:id", async (req, res) => {
  let { id } = req.params;
  id = id.toString();
  let { label, title, text, date, time } = req.body;
  label = label.toString();
  title = title.toString();
  time = date.toString() + "T" + time.toString();
  text = text.toString();

  let document = await Countdown.findOneAndUpdate({ _id: id }, { label: label, title: title, time: time, text: text, new: true });
  console.log(document);
  res.redirect("/countdownsection");
});

//countdown section ensd here

//event section starts here

//herosection starts here

//get request for herosection route
app.get("/events", async (req, res) => {
  let events = await Event.find();
  console.log(events);
  res.render("events.ejs", { events });
})


//post request on herosection
app.post("/events", async (req, res) => {
  let { date,subtitle,title,image,myFile } = req.body;
  date = date.toString();
  subtitle = subtitle.toString();
  title = title.toString();
  image = image.toString();
  myFile = myFile.toString();
  image = image + "/" + myFile;
  // console.log(req.body);
  console.log(date,subtitle,title,image,myFile);
  fs.readFile(image, async (err, data) => {

    if (err) throw err; // Fail if the file can't be read.
    imagekit.upload({
      file: data, //required
      fileName: myFile, //required
    }, async function (error, result) {
      if (error) console.log(error);
      else {
        // console.log(result);
        image = result.url;
        let imageid = result.fileId;
        let data = new Event({ date: date, image: image, subtitle: subtitle, title: title, imageid: imageid });
        await data.save();
        console.log(data);
      }
    });
  });

  // console.log(data);

  res.redirect("/events");
})

//get request to edit hero section
app.get("/editevent/:id", async (req, res) => {
  let { id } = req.params;
  id = id.toString();
  let data = await Event.find({ _id: id });
  console.log(data);
  res.render("editevent.ejs", { data });
})

//patch request on herosection redirect to herosection
app.patch("/editevent/:id", async (req, res) => {
  let { id } = req.params;
  let { date, subtitle,title,image, myFile } = req.body;
  date = date.toString();
  subtitle = subtitle.toString();
  title = title.toString();
  image = image.toString();
  myFile = myFile.toString();
  image = image + "/" + myFile;

  console.log(req.body);

  if (image == "/") {
    let document = await Event.findOneAndUpdate({ _id: id }, { date: date, subtitle: subtitle, title: title });
  }
  else {
    fs.readFile(image, async (err, data) => {

      if (err) throw err;   // Fail if the file can't be read.
      imagekit.upload({
        file: data,   //required
        fileName: myFile,   //required
      },
        async function (error, result) {
          if (error) console.log(error);
          else {
            // console.log(result);
            image = result.url;
            let imageid = result.fileId;
            let document = await Event.findOneAndReplace({ _id: id }, { date: date, subtitle: subtitle, title: title, image: image, imageid: imageid });

            let oldimageid = document.imageid;

            imagekit.deleteFile(oldimageid)
              .then(response => {
                console.log(response);
              })
              .catch(error => {
                console.log(error);
              });
          }
        });
    });
  }

  res.redirect("/events");
}
);

//delete request on herosection page and again redirect to same page
app.delete("/events/:id", async (req, res) => {
  let { id } = req.params;
  id = id.toString();
  let delData = await Event.findByIdAndDelete(id);

  let imageid = delData.imageid;

  imagekit.deleteFile(imageid)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
  // console.log(id);
  res.redirect("/events");
})


//herosection ends here

//event section ends here


//testimonials section starts here


//get request on testimonials
app.get("/testimonials", async (req, res) => {
  let testimonials = await Testimonial.find();
  res.render("testimonials.ejs", { testimonials });
})

//post request on testimonials
app.post("/testimonials", async (req, res) => {
  let { name, review, profilephoto, myFile } = req.body;
  name = name.toString();
  review = review.toString();
  profilephoto = profilephoto.toString();
  myFile = myFile.toString();
  profilephoto = profilephoto + "/" + myFile;
  console.log(req.body, profilephoto);
  fs.readFile(profilephoto, async (err, data) => {

    if (err) throw err; // Fail if the file can't be read.
    imagekit.upload({
      file: data, //required
      fileName: myFile, //required
    }, async function (error, result) {
      if (error) console.log(error);
      else {
        // console.log(result);
        profilephoto = result.url;
        let imageid = result.fileId;
        let data = new Testimonial({ name: name, review: review, profilephoto: profilephoto, imageid: imageid })
        await data.save();
        console.log(data);
      }
    });
  });

  // console.log(data);

  res.redirect("/testimonials");
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
app.patch("/edittestimonial/:id", async (req, res) => {
  let { id } = req.params;
  let { name, review, profilephoto,myFile} = req.body;
  name = name.toString();
  review = review.toString();
  profilephoto = profilephoto.toString();
  myFile = myFile.toString();
  profilephoto = profilephoto + "/" + myFile;

  console.log(req.body);

  if (profilephoto == "/") {
    let document = await Testimonial.findOneAndUpdate({ _id: id }, { name: name, review: review});
  }
  else {
    fs.readFile(profilephoto, async (err, data) => {

      if (err) throw err;   // Fail if the file can't be read.
      imagekit.upload({
        file: data,   //required
        fileName: myFile,   //required
      },
        async function (error, result) {
          if (error) console.log(error);
          else {
            // console.log(result);
            profilephoto = result.url;
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
          }
        });
    });
  }

  res.redirect("/testimonials");
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
app.get("/bookings",async (req,res)=>{
  let bookings = await Booking.find();
  console.log(bookings);
  res.render("bookatable.ejs",{bookings})
})

app.delete("/bookings/:id",async(req,res) => {
  let {id} = req.params;
  id = id.toString();
  let document = await Booking.findByIdAndDelete(id);
  res.redirect("/bookings");
})

//boojing section ends here

//workshop section
app.get("/workshop",async (req,res)=>{
  let registrations = await Workshop.find();
  console.log(registrations);
  res.render("workshopregistrations.ejs",{registrations})
})

app.delete("/workshop/:id",async(req,res) => {
  let {id} = req.params;
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
