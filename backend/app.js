//import libraries

const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv').config();

// create app and select port
const app = express();
const port = process.env.PORT || 3000;

//import routes used in app
const eventRouter = require("./routes/event");
const usersRouter = require("./routes/users");

//Middleware
app.use(cors());
app.use(express.json());

// test or check on server running or no
app.get("/", (req, res) => {
    res.send("Server Running");
});

//connection to DB
async function connectDb() {
    await mongoose.connect(process.env.MONGODB_URI, {
        dbName: "api-events"
    });
}

//active routes
app.use("/event", eventRouter);
app.use("/users", usersRouter);

//function connectDB and catch error
connectDb().catch((err) => {
    console.error(err);
});

//running server
app.listen(port, () => {
    console.log('Server running on port', port);
});
