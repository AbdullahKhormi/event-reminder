const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const eventRouter = require("./routes/event");
const usersRouter = require("./routes/users");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server Running");
});

async function connectDb() {
    await mongoose.connect(process.env.MONGODB_URI, {
        dbName: "api-events"
    });
}
app.use("/event", eventRouter);
app.use("/users", usersRouter);

connectDb().catch((err) => {
    console.error(err);
});

app.listen(port, () => {
    console.log('Server running on port', port);
});
