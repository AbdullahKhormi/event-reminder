const Event = require("./../db/events")
async function updateEvent(id,model){

    await Event.findOneAndUpdate({_id:id},model);
    return

}
async function deleteEvent(id){

    await Event.findByIdAndDelete(id);
    return

}
async function getEvents(first = 0, rows = 10) {
    const skip = parseInt(first);
    const limit = parseInt(rows);

    const [events, totalRecords] = await Promise.all([
      Event.find().skip(skip).limit(limit).lean(),
      Event.countDocuments()
    ]);

    return { events, totalRecords };
}
module.exports ={deleteEvent ,updateEvent,getEvents}