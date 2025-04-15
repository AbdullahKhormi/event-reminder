const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
    eventName: String,
    eventDate: String
});

const Event = mongoose.model('event', eventSchema);

module.exports = Event;
