const express = require("express"); // This is the web server
const app = express();
const mongoose = require("mongoose"); // It connects to the Database
const bodyParser = require("body-parser"); // Parse the body data, for the JSON files
const morgan = require("morgan"); // Logging in API calls
const { Server } = require("socket.io"); // enable web sockets
const http = require("http");
var cors = require("cors"); 
require("dotenv/config"); // intializing .env files

app.use(express.static("client"));

const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json()); // Parsing data
app.use(cors());
app.use(morgan("dev"));

// Importing the routes
const locationRoutes = require("./routes/locations");
const dateAndTimeRoutes = require("./routes/dateAndTime");

// Middlewares are enabled
app.use("/api/location", locationRoutes); 
app.use("/api/time-date", dateAndTimeRoutes);

// Default routing
app.get("/", (req, res) => {
  res.send("on home");
});

app.get("/test", (req, res) => {
  console.log("test endpoint!");
  res.send("test endpoint!");
});

app.use((req, res, next) => {
  // Invalid URL 
  const error = new Error("Not found");
  error.status = 404;
  next(error); 
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

mongoose.connect(
  process.env.MONGODB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  () => {
    console.log("Succesfully connected to DB..");
  }
);

io.on("connection", (socket) => {
  socket.on("message", (msg) => {
    io.emit("reply", `your message: ${msg}`);
  });
});

server.listen(4000, () => {
  console.log("Calling on *:3000");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Initializing server at..", PORT));
