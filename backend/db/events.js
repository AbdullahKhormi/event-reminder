const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
    eventName: String,
    eventDate: String,
    userId: { type: Number, required: true }
});

const Event = mongoose.model('event', eventSchema);

module.exports = Event;
