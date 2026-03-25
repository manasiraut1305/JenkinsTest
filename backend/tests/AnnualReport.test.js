// ✅ MOCK MULTER FIRST (VERY IMPORTANT)
jest.mock("multer", () => {
  const multerMock = () => ({
    fields: () => (req, res, cb) => cb(null), // skip actual upload
  });

  multerMock.diskStorage = jest.fn();

  multerMock.MulterError = class MulterError extends Error {
    constructor(code) {
      super();
      this.code = code;
    }
  };

  return multerMock;
});

const annualController = require("../controllers/annualReportController");

// ================= MOCK RESPONSE =================
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// ================= MOCK POOL =================
let mockQuery;

const mockPool = {
  request: jest.fn(() => ({
    input: jest.fn().mockReturnThis(),
    query: (...args) => mockQuery(...args),
  })),
};

beforeEach(() => {
  jest.clearAllMocks();
  mockQuery = jest.fn();
});

// =====================================================
// ADD ANNUAL REPORT
// =====================================================

describe("addAnnualReport", () => {

  test("should return 400 if year is missing", async () => {
    const req = {
      body: {},
      files: {
        reportPdf: [{ filename: "file.pdf" }],
      },
    };
    const res = mockRes();

    await annualController.addAnnualReport(req, res, mockPool);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should return 400 if reportPdf is missing", async () => {
    const req = {
      body: { year: "2024" },
      files: {},
    };
    const res = mockRes();

    await annualController.addAnnualReport(req, res, mockPool);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should succeed with only required fields", async () => {
    const req = {
      body: { year: "2024" },
      files: {
        reportPdf: [{ filename: "file.pdf" }],
      },
    };

    const res = mockRes();

    mockQuery.mockResolvedValue({
      recordset: [
        {
          id: 1,
          year: "2024",
          description: null,
          report_coverpage: null,
          report_pdf: "/uploads/file.pdf",
          annual_report_return: null,
          date: new Date(),
          isdelete: 0,
        },
      ],
    });

    await annualController.addAnnualReport(req, res, mockPool);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("should upload annual report successfully (all fields)", async () => {
    const req = {
      body: {
        year: "2024",
        description: "Test report",
      },
      files: {
        reportPdf: [{ filename: "file.pdf" }],
        reportCoverPage: [{ filename: "cover.jpg" }],
        returnReport: [{ filename: "return.pdf" }],
      },
    };

    const res = mockRes();

    mockQuery.mockResolvedValue({
      recordset: [
        {
          id: 1,
          year: "2024",
          description: "Test report",
          report_coverpage: "/uploads/cover.jpg",
          report_pdf: "/uploads/file.pdf",
          annual_report_return: "/uploads/return.pdf",
          date: new Date(),
          isdelete: 0,
        },
      ],
    });

    await annualController.addAnnualReport(req, res, mockPool);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("should handle DB error", async () => {
    const req = {
      body: { year: "2024" },
      files: {
        reportPdf: [{ filename: "file.pdf" }],
      },
    };

    const res = mockRes();

    mockQuery.mockRejectedValue(new Error("DB error"));

    await annualController.addAnnualReport(req, res, mockPool);

    expect(res.status).toHaveBeenCalledWith(500);
  });

});

// =====================================================
// GET ALL REPORTS
// =====================================================

describe("getAnnualReportAdmin", () => {

  test("should fetch all reports successfully", async () => {
    const req = {};
    const res = mockRes();

    mockQuery.mockResolvedValue({
      recordset: [
        {
          id: 1,
          year: "2024",
          description: "Test",
          report_coverpage: "a.jpg",
          report_pdf: "b.pdf",
          annual_report_return: null,
          isdelete: 0,
          date: new Date(),
        },
      ],
    });

    await annualController.getAnnualReportAdmin(req, res, mockPool);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("should handle error", async () => {
    const req = {};
    const res = mockRes();

    mockQuery.mockRejectedValue(new Error());

    await annualController.getAnnualReportAdmin(req, res, mockPool);

    expect(res.status).toHaveBeenCalledWith(500);
  });

});

// =====================================================
// GET ACTIVE REPORTS
// =====================================================

describe("getActiveAnnualReportAdmin", () => {

  test("should fetch active reports", async () => {
    const req = {};
    const res = mockRes();

    mockQuery.mockResolvedValue({ recordset: [] });

    await annualController.getActiveAnnualReportAdmin(req, res, mockPool);

    expect(res.status).toHaveBeenCalledWith(200);
  });

});

// =====================================================
// UPDATE REPORT
// =====================================================

describe("updateAnnualReport", () => {

  test("should return 400 if id is invalid", async () => {
    const req = {
      params: { id: "abc" },
      body: {},
      files: {},
    };
    const res = mockRes();

    await annualController.updateAnnualReport(req, res, mockPool);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should return 404 if report not found", async () => {
    const req = {
      params: { id: 1 },
      body: {},
      files: {},
    };
    const res = mockRes();

    mockQuery.mockResolvedValue({ recordset: [] });

    await annualController.updateAnnualReport(req, res, mockPool);

    expect(res.status).toHaveBeenCalledWith(404);
  });

});

// =====================================================
// TOGGLE DELETE
// =====================================================

describe("toggleAnnualReportDelete", () => {

  test("should return 400 if id is missing", async () => {
    const req = { params: {} };
    const res = mockRes();

    await annualController.toggleAnnualReportDelete(req, res, mockPool);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should return 400 if id is invalid", async () => {
    const req = { params: { id: "abc" } };
    const res = mockRes();

    await annualController.toggleAnnualReportDelete(req, res, mockPool);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should return 404 if report not found", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    mockQuery.mockResolvedValue({ recordset: [] });

    await annualController.toggleAnnualReportDelete(req, res, mockPool);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("should toggle delete successfully", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    mockQuery.mockResolvedValue({
      recordset: [
        {
          id: 1,
          year: "2024",
          description: "Test",
          report_coverpage: "a.jpg",
          report_pdf: "b.pdf",
          annual_report_return: null,
          date: new Date(),
          isdelete: 1,
        },
      ],
    });

    await annualController.toggleAnnualReportDelete(req, res, mockPool);

    expect(res.status).toHaveBeenCalledWith(200);
  });

});
