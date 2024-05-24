const Event = require("../models/events.js");
const path = require("path");
const fs = require('fs');
const { imagekit } = require("../config/imagekitconfig.js");
const { ExpressError } = require("../utils/wrapAsyncAndExpressError.js");

const showEvents = async (req, res) => {
  let events = await Event.find();
  console.log(events);
  res.render("eventsection/events.ejs", { events });
}


const createEvent = async (req, res, next) => {
  let { date, subtitle, title } = req.body;
  date = date.toString();
  subtitle = subtitle.toString();
  title = title.toString();
  if (!req.file) {
    return next(new ExpressError(400, "You have not added image,Add required image and submit!"));
  }

  let myFile = req.file.originalname;
  let fileLocation = path.join("./uploads", myFile);
  fs.readFile(fileLocation, async (err, data) => {
    if (err) throw next(new ExpressError(400, "Please Enter Valid file Name!"));

    imagekit.upload({
      file: data, //required
      fileName: myFile, //required
      folder: "/Koe_Cafe/events"
    }, async function (error, result) {
      if (error) throw next(new ExpressError(406, "Error in Uploading Image!"));
      else {
        let image = result.url;
        let imageid = result.fileId;
        let data = new Event({ date: date, image: image, subtitle: subtitle, title: title, imageid: imageid });
        await data.save();
        console.log(data);
        fs.unlinkSync(fileLocation);
        res.redirect("/admin/eventsection");
      }
    });
  });
}

const destroyEvent = async (req, res) => {
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
      throw error;
    });
  res.redirect("/admin/eventsection");
}

const renderEditForm = async (req, res) => {
  let { id } = req.params;
  id = id.toString();
  let data = await Event.find({ _id: id });
  // console.log(data);
  res.render("eventsection/editevent.ejs", { data });
}

const updateEvent = async (req, res, next) => {
  let { id } = req.params;
  let { date, subtitle, title, imagecheckbox } = req.body;
  date = date.toString();
  subtitle = subtitle.toString();
  title = title.toString();


  // console.log(req.body);

  if (!imagecheckbox) {
    let document = await Event.findOneAndUpdate({ _id: id }, { date: date, subtitle: subtitle, title: title });
    res.redirect("/admin/eventsection");
  }
  else {
    if (!req.file) {
      throw next(new ExpressError(400, "Image not Added, Please select required image"));
    }

    let myFile = req.file.originalname;
    let fileLocation = path.join("./uploads", myFile);

    fs.readFile(fileLocation, async (err, data) => {
      if (err) throw next(new ExpressError(400, "Please Enter Valid file Name!"));

      imagekit.upload({
        file: data,   //required
        fileName: myFile,   //required
        folder: "/Koe_Cafe/events"
      },
        async function (error, result) {
          if (error) {
            console.log(error);
            throw next(new ExpressError(406, "Error in Uploading Image!"));
          }
          else {
            // console.log(result);
            let image = result.url;
            let imageid = result.fileId;
            let document = await Event.findOneAndReplace({ _id: id }, { date: date, subtitle: subtitle, title: title, image: image, imageid: imageid });

            let oldimageid = document.imageid;

            imagekit.deleteFile(oldimageid)
              .then(response => {
                console.log(response);
              })
              .catch(error => {
                console.log(error);
                throw error;
              });

            fs.unlinkSync(fileLocation);
            res.redirect("/admin/eventsection");
          }
        });
    });
  }

}

module.exports = { showEvents, createEvent, destroyEvent, renderEditForm, updateEvent };