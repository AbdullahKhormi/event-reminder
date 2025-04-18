const express = require("express");
const router = express.Router();
const Event = require("./../db/events");
const { deleteEvent, updateEvent ,getEvents } = require("./../handler/events-handler");
router.get("", async (req, res) => {
  const first = req.query.first || 0;
  const rows = req.query.rows || 10;

  try {
    let result = await getEvents(first, rows);
    res.send(result); // { events: [...], totalRecords: 100 }
  } catch (err) {
    res.status(500).send({ error: "Something went wrong." });
  }
});

router.post("", async (req, res) => {
  // post method
  let eventData = req.body;
  let ev = new Event({
    eventName: eventData.eventName,
    eventDate: eventData.eventDate,
  });
  await ev.save();
  res.send(ev.toObject());
});

router.delete("/:id", async (req, res) => {
  //delete methode
  let id = req.params["id"];
  await deleteEvent(id);
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
