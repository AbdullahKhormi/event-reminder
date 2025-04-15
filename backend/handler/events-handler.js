const Event = require("./../db/events")
async function updateEvent(id,model){

    await Event.findOneAndUpdate({_id:id},model);
    return

}
async function deleteEvent(id){

    await Event.findByIdAndDelete(id);
    return

}
async function getEvents(){
let test = await Event.find();
return test.map((e)=>e.toObject())
}
module.exports ={deleteEvent ,updateEvent,getEvents}