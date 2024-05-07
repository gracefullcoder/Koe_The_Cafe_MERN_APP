const Event = require("../models/events.js");
const path = require("path");
const fs = require('fs');
const { imagekit } = require("../config/imagekitconfig.js");

const showEvents = async (req, res) => {
    let events = await Event.find();
    console.log(events);
    res.render("eventsection/events.ejs", { events });
  }


const createEvent = async (req, res) => {
    let { date, subtitle, title } = req.body;
    date = date.toString();
    subtitle = subtitle.toString();
    title = title.toString();
    let myFile = req.file.originalname;
    let fileLocation = path.join("./uploads", myFile);
    // console.log(req.body);
    // console.log(date, subtitle, title, image, myFile);
    fs.readFile(fileLocation, async (err, data) => {
  
      if (err) throw err; // Fail if the file can't be read.
      imagekit.upload({
        file: data, //required
        fileName: myFile, //required
      }, async function (error, result) {
        if (error) console.log(error);
        else {
          // console.log(result);
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
      });
    // console.log(id);
    res.redirect("/admin/eventsection");
  }
  
const renderEditForm = async (req, res) => {
    let { id } = req.params;
    id = id.toString();
    let data = await Event.find({ _id: id });
    console.log(data);
    res.render("eventsection/editevent.ejs", { data });
  }

const updateEvent = async (req, res) => {
    let { id } = req.params;
    let { date, subtitle, title,imagecheckbox} = req.body;
    date = date.toString();
    subtitle = subtitle.toString();
    title = title.toString();
    
  
    console.log(req.body);
  
    if (!imagecheckbox) {
      let document = await Event.findOneAndUpdate({ _id: id }, { date: date, subtitle: subtitle, title: title });
      res.redirect("/admin/eventsection");
    }
    else {
      let myFile = req.file.originalname;
      let fileLocation = path.join("./uploads", myFile);
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
                });
                fs.unlinkSync(fileLocation);
                res.redirect("/admin/eventsection");
            }
          });
      });
    }
  
  }

module.exports = {showEvents,createEvent,destroyEvent,renderEditForm,updateEvent};