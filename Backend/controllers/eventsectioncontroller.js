const Event = require("../models/events.js");
const { ExpressError } = require("../utils/wrapAsyncAndExpressError.js");
const { uploadFile, deleteFile } = require("../config/imagekitconfig.js");

const showEvents = async (req, res) => {
  console.log("i send events");
  let events = await Event.find();
  res.status(200).json(events);
}


const createEvent = async (req, res, next) => {
  let { subtitle, title, date, detailsLink } = req.body;

  console.log("yes again", req.body);
  if (!req.file) {
    return next(new ExpressError(400, "You have not added image,Add required image and submit!"));
  }

  let myFile = req.file.originalname;
  let { fileUrl, fileId } = await uploadFile(myFile, "events");

  let newEvent = new Event({ title: title, subtitle: subtitle, date: date, detailsLink: detailsLink, image: fileUrl, imageid: fileId })
  await newEvent.save();

  return res.status(200).json({ success: true, message: "Event Added Successfully🎉!", newData: newEvent });
}

const destroyEvent = async (req, res) => {

  let { id } = req.params;
  id = id.toString();
  let delData = await Event.findByIdAndDelete(id);

  let imageid = delData.imageid;

  const data = await deleteFile(imageid);
  console.log(data);

  res.status(200).json({ success: true, message: "Event Deleted Successfully!" });
}

const updateEvent = async (req, res, next) => {
  console.log("yes it's me event update");
  let { id } = req.params;
  let { date, subtitle, title, detailsLink } = req.body;


  if (!req.file) {
    let updatedEvent = await Event.findOneAndUpdate({ _id: id }, { date: date, subtitle: subtitle, title: title, detailsLink }, { new: true });
    console.log("i m in", updateEvent);
    return res.status(200).json({ success: true, message: "Event Edited Successfully", updatedData: updatedEvent })
  }
  else {
    let myFile = req.file.originalname;
    let { fileUrl, fileId } = await uploadFile(myFile, "events");
    console.log(fileUrl, fileId);
    let oldEvent = await Event.findOneAndReplace({ _id: id }, { date: date, subtitle: subtitle, title: title, detailsLink, image: fileUrl, imageid: fileId });

    let oldimageid = oldEvent.imageid;
    await deleteFile(oldimageid);

    let updatedEvent = await Event.findById(id, { date: date, subtitle: subtitle, title: title, detailsLink, image: fileUrl, imageid: fileId });
    res.status(200).json({ success: true, message: "Event Edited Successfully", updatedData: updatedEvent })
  }

}


module.exports = { showEvents, createEvent, destroyEvent, updateEvent };