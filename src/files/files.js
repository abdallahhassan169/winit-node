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
    cb(null, "/var/data/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + extname(file.originalname));
  },
});
export const upload = multer({ storage: storage });

export const add_assets = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { images } = req.files;
    const { type } = req.body;

    await Promise.all(
      images.map(async (image) => {
        await client.query(
          `INSERT INTO banners (banner, type) VALUES ($1, $2)`,
          [image.filename, type]
        );
      })
    );

    await client.query("COMMIT");

    res.send({ message: "success" });
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("Error in add_assets endpoint:", e);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
};
export const delete_asset = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { id } = req.body;

    await client.query(`delete from banners where id = $1`, [id]);

    await client.query("COMMIT");

    res.send({ message: "success" });
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("Error in add_assets endpoint:", e);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
};
export const dash_banners = async (req, res) => {
  try {
    const { rows } = await pool.query(
      ` select * from banners order by id desc
    `
    );

    res.send(rows);
  } catch (e) {
    console.log(e);
    res.send({ "error ": e });
  }
};
export const banners = async (req, res) => {
  try {
    const { rows } = await pool.query(
      ` select * from banners order by id desc
    `
    );
    const banners = rows.filter((banner) => banner.type === "banners");
    const slides = rows.filter((banner) => banner.type === "slides");

    res.send({ banners, slides });
  } catch (e) {
    console.log(e);
    res.send({ "error ": e });
  }
};
export const get_image = (req, res) => {
  const filename = req.query.img;
  console.log(req.params, "params");
  try {
    res.sendFile(`/var/data/images/${filename}`);
  } catch (e) {
    res.status(500).send({ err: e.message });
  }
};
