import "./db/index.js";
import express from "express";
import cors from "cors";
import authRouter from "./routes/authRouter.js";
import productsRouter from "./routes/productsRouter.js";
import ordersRouter from "./routes/ordersRouter.js";
import usersRouter from "./routes/usersRouter.js";
import reviewsRouter from "./routes/reviewsRouter.js";
import errorHandler from "./middlewares/errorHandler.js";
import dbInit from "./db/index.js";
import upload from "./middlewares/multer.js";
import cloudinary from "./utils/cloudinary.js";
import { join } from "path";

const app = express();
const port = process.env.PORT || 8080;

app.use(cors({ origin: process.env.SPA_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.static(join(import.meta.dirname, "uploads")))
app.use("/auth", authRouter);

app.use("/products", upload.single('image'), function (req, res, next) {
  cloudinary.uploader.upload(req.file.path, function (error, result) {
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(200).json({success: true, message: "Image uploaded", data: result});
      next();  
    }
  });
}, productsRouter);
app.use("/orders", ordersRouter);
app.use("/users", usersRouter);
app.use("/reviews", reviewsRouter);
app.use("*", (req, res) => res.status(404).json({ error: "Not found" }));
app.use(errorHandler);

dbInit()

app.listen(port, () => console.log(`Server listening on port : ${port}`));
