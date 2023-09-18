require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const path = require("path");

const bodyParser = require("body-parser");
const cloudinary = require("cloudinary");

// socket
const http = require("http").Server(app);
const socketIO = require("socket.io")(http);

// Connect to MongoDB
mongoose.set("strictQuery", false);
mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.URI_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// Middleware
app.use("/uploads", express.static("uploads"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
 
  })
);

 

 

// Routes
app.use("/api/user", require("./routes/user.routes"));

// Socket
let userLocation = [];

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("userLocation", (data) => {
    // console.log(data);
    let userLocationCopy = userLocation;
    let index = userLocation.findIndex((obj) => obj.id === data.id);
    let existUser = index !== -1;
    if (existUser) {
      userLocation[index] = data;
    } else {
      userLocation.push(data);
    }
    console.log(userLocation);

    socketIO.emit("receiveUser", userLocation);
  });

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
});

// Port
const PORT = process.env.PORT || 5000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
