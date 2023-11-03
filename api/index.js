import express from "express";
const app = express();

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import friendsRoutes from "./routes/friends.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import relationshipRoutes from "./routes/relationships.js";

import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { db } from "./connect.js";

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
//middlewares
app.get("/", (req,res)=>{
  res.send({msg:"Done bro"})
})

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173",}));//
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  console.log("file");
  res.status(200).json(file.filename);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipRoutes);

// To Check DataBase is connected or not
db.connect((err)=>{
  if(err){
    console.log("there is an error",err);
    console.log(err);
    return err
  }
  console.log("Database Connected");

})

// Starting Server..... 
app.listen(8800, () => {
  console.log("Server Started API working!");
});


