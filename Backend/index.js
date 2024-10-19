const express = require("express");
const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const session = require("express-session");
const MongodbStore = require("connect-mongodb-session")(session);
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const authRoutes = require("./Routes/authRoutes");
const postRoutes = require("./Routes/postRoutes");
const conversationRoutes = require("./Routes/conversationRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const s3 = require("./util/AWS");
dotenv.config();
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Headers", "Content-type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "img-src": ["'self'", "http://localhost:8080", "data:"],
      },
    },
    crossOriginResourcePolicy: {
      policy: "same-site",
    },
  })
);
const storage = multerS3({
  s3: s3,
  bucket: "chitchatt",
  acl: "public-read",
  key: function (req, file, cb) {
    cb(null, "uploads/" + Date.now() + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    return cb(null, true);
  }
  cb(null, false);
};
const store = new MongodbStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});
// app.use(morgan("short"));
app.use(
  session({
    secret: "theSecretKey",
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: "Lax",
    },
  })
);
app.use(
  multer({ storage: storage, fileFilter: fileFilter }).single("postImage")
);

app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/message", messageRoutes);
const Server = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(process.env.PORT || 8080, () => {
      console.log("listenting...");
    });
  } catch (err) {
    console.log("error connecting to dataBase:-(");
  }
};
Server();
