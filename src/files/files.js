import multer from "multer";
import { extname } from "path";
import pool from "../config.js";
export const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG and PNG images are allowed."),
      false
    );
  }
};

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../../images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + extname(file.originalname));
  },
});
export const upload = multer({ storage: storage });

export const add_assets = async (req, res) => {
  try {
    const { banner, image_1, image_2 } = req.body;
    console.log(req.body);
    const { rows } = await pool.query(
      `  INSERT INTO public.public_assets(
	  banner, image_1, image_2)
	VALUES ( $1, $2, $3); `,
      [banner, image_1, image_2]
    );
    if (rows.length === 0) {
      throw new Error("Failed to insert into database please add one.");
    }
    res.send({ message: "success" });
  } catch (e) {
    console.log(e);
    res.send({ "error ": e });
  }
};

export const get_image = (req, res) => {
  const filename = req.query.img;
  console.log(req.params, "params");
  try {
    res.sendFile(`${process.cwd()}/images/${filename}`);
  } catch (e) {
    res.status(500).send({ err: e.message });
  }
};
