const express = require("express");
const router = express.Router();
const Event = require("./../db/events");
const { deleteEvent, updateEvent ,getEvents } = require("./../handler/events-handler");
router.get("", async (req, res) => {
  const first = parseInt(req.query.first) || 0;
  const rows = parseInt(req.query.rows) || 10;
  const userId = parseInt(req.query.userId);

  if (!userId) {
    return res.status(400).send({ error: "userId is required" });
  }

  try {
    const events = await Event.find({ userId })
                              .skip(first)
                              .limit(rows)
                              .exec();

    const totalRecords = await Event.countDocuments({ userId });

    res.send({ events, totalRecords });
  } catch (err) {
    res.status(500).send({ error: "Something went wrong." });
  }
});

router.post("", async (req, res) => {
  let eventData = req.body;

  if (!eventData.userId) {
    return res.status(400).send({ error: "userId is required" });
  }

  let ev = new Event({
    eventName: eventData.eventName,
    eventDate: eventData.eventDate,
    userId: eventData.userId,
  });

  await ev.save();
  res.send(ev.toObject());
});

router.delete("/:id", async (req, res) => {
  const id = req.params["id"];
  const userId = parseInt(req.query.userId);

  const event = await Event.findOne({ _id: id, userId });

  if (!event) {
    return res.status(404).send({ message: "Event not found or not yours" });
  }

  await Event.deleteOne({ _id: id });
  res.send({ message: "Deleted" });
});
router.get("/:id", async (req, res) => {
  const id = req.params["id"];
  const event = await Event.findById(id);
  if (!event) {
    return res.status(404).send({ message: "Event not found" });
  }
  res.send(event.toObject());
});

router.put("/:id", async (req, res) => { //update method
  let model = req.body;
  let id = req.params["id"];
  await updateEvent(id,model)
  res.send({message:"ok"})
});
module.exports = router;
