const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ Create uploads folder if not exists
const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    try {
      const uniqueName =
        Date.now() + "-" + Math.round(Math.random() * 1e9);

      const ext = path.extname(file.originalname).toLowerCase();

      cb(null, uniqueName + ext);

    } catch (error) {
      cb(error);
    }
  },
});

// ✅ File filter
const annualReportFileFilter = (req, file, cb) => {

  const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf"];

  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    return cb(new Error("Only JPG, JPEG, PNG, PDF files allowed"), false);
  }

  cb(null, true);
};


// ✅ Multer instance (100MB limit)
const upload = multer({
  storage: storage,

  fileFilter: annualReportFileFilter,

  limits: {
    fileSize: 100 * 1024 * 1024, // ✅ EXACT 50MB
  },

}).fields([
  { name: "reportPdf", maxCount: 1 },
  { name: "reportCoverPage", maxCount: 1 },
  { name: "returnReport", maxCount: 1 },
]);



// ================= CONTROLLER =================

exports.addAnnualReport = async (req, res, pool) => {

  upload(req, res, async function (err) {

    try {

      // ✅ Handle multer errors
      if (err instanceof multer.MulterError) {

        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            statusCode: 400,
            message: "File size exceeds 50MB limit.",
            data: null,
          });
        }

        return res.status(400).json({
          statusCode: 400,

          message:"Now u see me" ,   
          data: null,
        });
      }

      if (err) {
        return res.status(400).json({
          statusCode: 400,
          message: err.message,
          data: null,
        });
      }


      const { year, description } = req.body;


      // ✅ File paths
      const reportPdf = req.files?.reportPdf?.[0]
        ? `/uploads/${req.files.reportPdf[0].filename}`
        : null;

      const reportCoverPage = req.files?.reportCoverPage?.[0]
        ? `/uploads/${req.files.reportCoverPage[0].filename}`
        : null;
        
      const returnReport = req.files?.returnReport?.[0]
        ? `/uploads/${req.files.returnReport[0].filename}`
        : null;


      // ✅ Validation
      if (!year) {
        return res.status(400).json({
          statusCode: 400,
          message: "Year is required.",
          data: null,
        });
      }

      if (!reportPdf) {
        return res.status(400).json({
          statusCode: 400,
          message: "Report PDF is required.",
          data: null,
        });
      }


      // ✅ SQL INSERT
      const query = `
        INSERT INTO annualReport
        (
          year,
          description,
          report_coverpage,
          report_pdf,
          annual_report_return,
          date,
          isdelete
        )
        OUTPUT INSERTED.*
        VALUES
        (
          @year,
          @description,
          @reportCoverPage,
          @reportPdf,
          @returnReport,
          GETDATE(),
          0
        )
      `;

      const request = pool.request();

      request.input("year", year);
      request.input("description", description || null);
      request.input("reportCoverPage", reportCoverPage);
      request.input("reportPdf", reportPdf);
      request.input("returnReport", returnReport || null);

      const result = await request.query(query);

      const inserted = result.recordset[0];


      return res.status(201).json({
        statusCode: 201,
        message: "Annual report uploaded successfully.",
        data: {
          id: inserted.id,
          year: inserted.year,
          description: inserted.description,
          reportCoverPage: inserted.report_coverpage,
          reportPdf: inserted.report_pdf,
          returnReport: inserted.annual_report_return,
          date: inserted.date,
          isDelete: Boolean(inserted.isdelete),
        },
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        statusCode: 500,
        message: "Server error while uploading annual report.",
        data: null,
      });
    }

  });

};

exports.getAnnualReportAdmin = async (req, res, pool) => {
  try {
    const query = `
      SELECT
        id,
        year,
        description,
        report_coverpage,
        report_pdf,
        annual_report_return,
        isdelete,
        date
      FROM annualReport
      ORDER BY CONVERT(datetime, date, 113) DESC
    `;

    const result = await pool.request().query(query);

    const reports = result.recordset.map(r => ({
      id: r.id,
      year: r.year,
      description: r.description,
      reportCoverPage: r.report_coverpage,
      reportPdf: r.report_pdf,
      returnReport: r.annual_report_return,
      isDelete: Boolean(r.isdelete),
      date: r.date
    }));

    res.status(200).json({
      statusCode: 200,
      message: "Annual reports fetched successfully.",
      data: reports
    });

  } catch (error) {
    console.error("Error fetching annual reports:", error);
    res.status(500).json({
      statusCode: 500,
      message: "Error fetching annual reports.",
      data: null
    });
  }
};

exports.getActiveAnnualReportAdmin = async (req, res, pool) => {
  try {
    const query = `
      SELECT
        id,
        year,
        description,
        report_coverpage,
        report_pdf,
        annual_report_return,
        isdelete,
        date
      FROM annualReport
      where isdelete=0
      ORDER BY CONVERT(datetime, date, 113) DESC
    `;

    const result = await pool.request().query(query);

    const reports = result.recordset.map(r => ({
      id: r.id,
      year: r.year,
      description: r.description,
      reportCoverPage: r.report_coverpage,
      reportPdf: r.report_pdf,
      returnReport: r.annual_report_return,
      isDelete: Boolean(r.isdelete),
      date: r.date
    }));

    res.status(200).json({
      statusCode: 200,
      message: "Annual reports fetched successfully.",
      data: reports
    });

  } catch (error) {
    console.error("Error fetching annual reports:", error);
    res.status(500).json({
      statusCode: 500,
      message: "Error fetching annual reports.",
      data: null
    });
  }
};

const uploadReport = multer({ storage, fileFilter: annualReportFileFilter }).fields([
  { name: "reportCoverPage", maxCount: 1 },
  { name: "reportPdf", maxCount: 1 },
  { name: "returnReport", maxCount: 1 },
]);

// // ✅ Export upload so routes can use it
exports.uploadReport = uploadReport;

// helper: delete file safely
const safeUnlink = (filePathFromDb) => {
  try {
    if (!filePathFromDb) return;

    const fileName = path.basename(filePathFromDb);
    const fullPath = path.join(uploadDir, fileName);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    } else {
      console.warn("File not found, skip delete:", fullPath);
    }
  } catch (e) {
    console.warn("Old file delete failed:", e.message);
  }
};



exports.updateAnnualReport = async (req, res, pool) => {
  upload(req, res, async function (err) {
    try {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ statusCode: 400, message: "File exceeds 50MB.", data: null });
        }
        return res.status(400).json({ statusCode: 400, message: err.message, data: null });
      }
      if (err) return res.status(400).json({ statusCode: 400, message: err.message, data: null });

      // Now req.body exists
      const id = Number(req.params.id);
      const { year, description, date } = req.body;

      if (!id || Number.isNaN(id)) {
        return res.status(400).json({ statusCode: 400, message: "Valid id is required.", data: null });
      }

      // Fetch existing report
      const existingRes = await pool.request().input("id", id).query(`
        SELECT TOP 1 * FROM annualReport WHERE id=@id
      `);
      const existing = existingRes.recordset[0];
      if (!existing) return res.status(404).json({ statusCode: 404, message: "Report not found", data: null });

      // File paths
      const reportPdf = req.files?.reportPdf?.[0]
        ? `/uploads/${req.files.reportPdf[0].filename}`
        : existing.report_pdf;

      const reportCoverPage = req.files?.reportCoverPage?.[0]
        ? `/uploads/${req.files.reportCoverPage[0].filename}`
        : existing.report_coverpage;

      const returnReport = req.files?.returnReport?.[0]
        ? `/uploads/${req.files.returnReport[0].filename}`
        : existing.returnReport;

      // Optional: delete old files if replaced
if (req.files?.reportPdf?.[0] && existing.report_pdf) {
  safeUnlink(path.basename(existing.report_pdf));
}

if (req.files?.reportCoverPage?.[0] && existing.report_coverpage) {
  safeUnlink(path.basename(existing.report_coverpage));
}
if (req.files?.returnReport?.[0] && existing.returnReport) {
  safeUnlink(path.basename(existing.returnReport));
}


      // Update SQL
      const result = await pool
        .request()
        .input("id", id)
        .input("year", year || existing.year)
        .input("description", description || existing.description)
        .input("reportPdf", reportPdf)
        .input("reportCoverPage", reportCoverPage)
        .input("returnReport", returnReport)
        .input("date", date || existing.date)
        .query(`
          UPDATE annualReport
          SET
            year=@year,
            description=@description,
            report_pdf=@reportPdf,
            report_coverpage=@reportCoverPage,
            annual_report_return=@returnReport,
            date=@date
          OUTPUT INSERTED.*
          WHERE id=@id
        `);

      return res.status(200).json({
        statusCode: 200,
        message: "Annual report updated successfully.",
        data: result.recordset[0],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ statusCode: 500, message: error.message, data: null });
    }
  });
};





exports.toggleAnnualReportDelete = async (req, res, pool) => {
  try {
    let { id } = req.params;

    // ✅ validation
    if (id === undefined || id === null || id === "") {
      return res.status(400).json({
        statusCode: 400,
        message: "id is required.",
        data: null,
      });
    }

    // optional: normalize id to number if your DB column is int
    const parsedId = Number(id);
    if (Number.isNaN(parsedId) || parsedId <= 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "id must be a valid number.",
        data: null,
      });
    }

    const query = `
      UPDATE annualReport
      SET isdelete =
        CASE
          WHEN isdelete = 1 THEN 0
          WHEN isdelete = 0 THEN 1
          ELSE 0
        END
      OUTPUT
        INSERTED.id,
        INSERTED.year,
        INSERTED.description,
        INSERTED.report_coverpage,
        INSERTED.report_pdf,
        INSERTED.annual_report_return,
        INSERTED.date,
        INSERTED.isdelete
      WHERE id = @id;
    `;

    const request = pool.request();
    request.input("id", parsedId);

    const result = await request.query(query);
    const updated = result.recordset?.[0];

    if (!updated) {
      return res.status(404).json({
        statusCode: 404,
        message: "Annual report not found.",
        data: null,
      });
    }

    const isDelete = Boolean(updated.isdelete);

    return res.status(200).json({
      statusCode: 200,
      message: "Annual report visibility toggled successfully.",
      data: {
        id: updated.id,
        year: updated.year,
        description: updated.description,
        reportCoverPage: updated.report_coverpage,
        reportPdf: updated.report_pdf,
        returnReport: updated.annual_report_return,
        date: updated.date,
        isDelete,
        visible: !isDelete,
      },
    });
  } catch (error) {
    console.error("Error toggling annual report delete status:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Error toggling annual report delete status.",
      data: null,
    });
  }
};

