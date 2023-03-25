import express, { Request, Response } from "express";
import multer from "multer";
import cors from "cors";
import path from "path";

const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    const fileName = file.fieldname + "-" + uniqueSuffix + extension;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

const uploadsPath = path.join(__dirname, "../uploads");

app.use("/uploads", express.static(uploadsPath));

app.post("/file", upload.single("file"), (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      throw new Error("File not found");
    }

    res.status(200).json({
      status: 200,
      message: "File uploaded successfully",
      filename: file.filename,
      url: `http://localhost:${PORT}/uploads/${file.filename}`,
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});
  
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});