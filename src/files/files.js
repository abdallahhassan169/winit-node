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
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { banner, images } = req.files;
    console.log(images, "ll");
    const bannerInsertResult = await client.query(
      `INSERT INTO banners (banner) VALUES ($1) RETURNING id`,
      [banner[0].filename]
    );
    const bannerId = bannerInsertResult.rows[0].id;

    await Promise.all(
      images.map(async (image) => {
        await client.query(
          `INSERT INTO slides (url, banner_id) VALUES ($1, $2)`,
          [image.filename, bannerId]
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
export const banners = async (req, res) => {
  try {
    const { rows } = await pool.query(
      ` SELECT
    json_build_object(
        'banner',b.*,
        'slides', json_agg(s.*)
    ) AS full_data
FROM banners b join slides s on b.id = s.banner_id  group by   b.id  order by b.id desc limit 1
    `
    );

    res.send({ rows });
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
