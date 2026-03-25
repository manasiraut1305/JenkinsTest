const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Configure how/where to store the file
const storage = multer.diskStorage({
  destination: "uploads/images/",
  filename: (req, file, cb) => {
          cb(null, Date.now() + path.extname(file.originalname));
      }
});

exports.upload = multer({ storage: storage });

exports.getImages = async (req, res, pool, PORT) => {
  try {
    const result = await pool
      .request()
      .query("SELECT * FROM Image where visible= 0 ORDER BY img_id DESC");

    const baseUrl = process.env.BASE_URL;
    const uploadDir = path.join(__dirname, "../uploads/images");

    const images = result.recordset
      .filter(img => {
        const filePath = path.join(uploadDir, img.img_src);
        return fs.existsSync(filePath); // keep only existing files
      })
      .map(img => ({
        ...img,
        img_src: `/Uploads/images/${img.img_src}`,
      }));

    res.json(images);
  } catch (err) {
    console.error("Query failed (images):", err);
    res.status(500).send("Error fetching images");
  }
};

exports.getAllImages = async (req, res, pool, PORT) => {
  try {
    const result = await pool
      .request()
      .query("SELECT * FROM Image ORDER BY img_id DESC");

    const baseUrl = process.env.BASE_URL;
    const uploadDir = path.join(__dirname, "../uploads/images");

    const images = result.recordset
      .filter(img => {
        const filePath = path.join(uploadDir, img.img_src);
        return fs.existsSync(filePath); // keep only existing files
      })
      .map(img => ({
        ...img,
        img_src: `/Uploads/images/${img.img_src}`,
      }));

    res.json(images);
  } catch (err) {
    console.error("Query failed (images):", err);
    res.status(500).send("Error fetching images");
  }
};
exports.addImage = async (req, res, pool) => {
  try {
    if (!req.file) {
      return res.status(400).send("No image uploaded.");
    }

    const { img_title, showonHome } = req.body;
    const fileName = req.file.filename; // This is the name inside //Uploads/images

    await pool.request()
      .input('title', img_title)
      .input('src', fileName) //Save the filename string
      .input('thumb', fileName) // Use same for thumb or generate one
      .input('home', showonHome || 0)
      .query(`INSERT INTO Image (img_title, img_src, img_thumb, showonHome, visible) 
              VALUES (@title, @src, @thumb, @home, 1)`);

    res.status(201).json({ 
      message: "Image uploaded and saved!",
      fileName: fileName 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving to database");
  }
};

exports.updateImage = async (req, res, pool) => {
  const { id } = req.params;
  const { img_title, showonHome } = req.body;
  let fileName = null;

  try {
    // 1. Check if a new file was uploaded
    if (req.file) {
      fileName = req.file.filename;

      // 2. Find the old image to delete it from the server
      const existingRecord = await pool.request()
        .input('id', id)
        .query("SELECT img_src FROM Image WHERE img_id = @id");

      if (existingRecord.recordset.length > 0) {
        const oldFileName = existingRecord.recordset[0].img_src;
        const oldFilePath = path.join(__dirname, "..//Uploads/images", oldFileName);
        
        // Delete old file if it exists
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    // 3. Build the SQL Query dynamically based on whether we have a new image
    const request = pool.request()
      .input('id', id)
      .input('title', img_title)
      .input('home', showonHome || 0);

    let query = `UPDATE Image SET img_title = @title, showonHome = @home`;

    if (fileName) {
      request.input('src', fileName);
      request.input('thumb', fileName);
      query += `, img_src = @src, img_thumb = @thumb`;
    }

    query += ` WHERE img_id = @id`;

    await request.query(query);

    res.json({ message: "Update successful!", newFile: fileName || "No file changed" });
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).send("Error updating image");
  }
};

exports.toggleVisibility = async (req, res, pool) => {
  const { id } = req.params;

  try {
    // 1. Check if the record exists first (optional but recommended)
    const checkRecord = await pool.request()
      .input('id', id)
      .query("SELECT visible FROM Image WHERE img_id = @id");

    if (checkRecord.recordset.length === 0) {
      return res.status(404).send("Image record not found.");
    }

    // 2. Perform the toggle (1 - current_value) 
    // If visible is 1, 1-1 = 0. If visible is 0, 1-0 = 1.
    const result = await pool.request()
      .input('id', id)
      .query(`
        UPDATE Image 
        SET visible = CASE WHEN visible = 1 THEN 0 ELSE 1 END 
        WHERE img_id = @id
      `);

    // 3. Return the new status to the frontend
    const newStatus = checkRecord.recordset[0].visible === 1 ? "Hidden" : "Visible";
    
    res.json({ 
      message: `Image visibility toggled successfully.`, 
      status: newStatus 
    });

  } catch (err) {
    console.error("Toggle visibility failed:", err);
    res.status(500).send("Error updating visibility status");
  }
};