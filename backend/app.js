const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;
const cors = require("cors")
const eventRouter = require("./routes/event");
app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server Running");
});

async function connectDb() {
    await mongoose.connect("mongodb://localhost:27017", {
        dbName: "api-events"
    });
    console.log("done");
}

app.use("/event", eventRouter);

connectDb().catch((err) => {
    console.error(err);
});

app.listen(port, () => {
    console.log('server running on port', port);
});
