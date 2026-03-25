// ================= MOCKS =================

// Mock multer (skip actual upload)
jest.mock("multer", () => {
  const multerMock = () => ({
    single: () => (req, res, cb) => cb(null),
  });

  multerMock.diskStorage = jest.fn();

  return multerMock;
});

// Mock fs
jest.mock("fs", () => ({
  existsSync: jest.fn(),
  unlinkSync: jest.fn(),
}));

const fs = require("fs");
const imageController = require("../controllers/imageController");

// ================= MOCK RESPONSE =================
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
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

  // silence logs
  jest.spyOn(console, "error").mockImplementation(() => {});
});

// =====================================================
// GET IMAGES
// =====================================================

describe("getImages", () => {

  test("should return filtered images", async () => {
    const req = {};
    const res = mockRes();

    mockQuery.mockResolvedValue({
      recordset: [
        { img_id: 1, img_src: "a.jpg", visible: 0 },
      ],
    });

    fs.existsSync.mockReturnValue(true);

    await imageController.getImages(req, res, mockPool);

    expect(res.json).toHaveBeenCalled();
  });

  test("should handle DB error", async () => {
    const req = {};
    const res = mockRes();

    mockQuery.mockRejectedValue(new Error());

    await imageController.getImages(req, res, mockPool);

    expect(res.status).toHaveBeenCalledWith(500);
  });

});

// =====================================================
// GET ALL IMAGES
// =====================================================

describe("getAllImages", () => {

  test("should return all images", async () => {
    const req = {};
    const res = mockRes();

    mockQuery.mockResolvedValue({
      recordset: [
        { img_id: 1, img_src: "a.jpg" },
      ],
    });

    fs.existsSync.mockReturnValue(true);

    await imageController.getAllImages(req, res, mockPool);

    expect(res.json).toHaveBeenCalled();
  });

});

// =====================================================
// ADD IMAGE
// =====================================================

describe("addImage", () => {

  test("should return 400 if no file uploaded", async () => {
    const req = { body: {} };
    const res = mockRes();

    await imageController.addImage(req, res, mockPool);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should upload image successfully", async () => {
    const req = {
      file: { filename: "test.jpg" },
      body: { img_title: "Test", showonHome: 1 },
    };

    const res = mockRes();

    mockQuery.mockResolvedValue({});

    await imageController.addImage(req, res, mockPool);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("should handle DB error", async () => {
    const req = {
      file: { filename: "test.jpg" },
      body: {},
    };

    const res = mockRes();

    mockQuery.mockRejectedValue(new Error());

    await imageController.addImage(req, res, mockPool);

    expect(res.status).toHaveBeenCalledWith(500);
  });

});

// =====================================================
// UPDATE IMAGE
// =====================================================

describe("updateImage", () => {

  test("should update without new file", async () => {
    const req = {
      params: { id: 1 },
      body: { img_title: "Updated" },
    };

    const res = mockRes();

    mockQuery.mockResolvedValue({});

    await imageController.updateImage(req, res, mockPool);

    expect(res.json).toHaveBeenCalled();
  });

  test("should update with new file and delete old one", async () => {
    const req = {
      params: { id: 1 },
      file: { filename: "new.jpg" },
      body: {},
    };

    const res = mockRes();

    // first call → fetch old file
    mockQuery
      .mockResolvedValueOnce({
        recordset: [{ img_src: "old.jpg" }],
      })
      .mockResolvedValueOnce({});

    fs.existsSync.mockReturnValue(true);

    await imageController.updateImage(req, res, mockPool);

    expect(fs.unlinkSync).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });

  test("should handle update error", async () => {
    const req = {
      params: { id: 1 },
      body: {},
    };

    const res = mockRes();

    mockQuery.mockRejectedValue(new Error());

    await imageController.updateImage(req, res, mockPool);

    expect(res.status).toHaveBeenCalledWith(500);
  });

});

// =====================================================
// TOGGLE VISIBILITY
// =====================================================

describe("toggleVisibility", () => {

  test("should return 404 if image not found", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    mockQuery.mockResolvedValue({ recordset: [] });

    await imageController.toggleVisibility(req, res, mockPool);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("should toggle visibility successfully", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    mockQuery
      .mockResolvedValueOnce({
        recordset: [{ visible: 1 }],
      })
      .mockResolvedValueOnce({});

    await imageController.toggleVisibility(req, res, mockPool);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("successfully"),
      })
    );
  });

  test("should handle error", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    mockQuery.mockRejectedValue(new Error());

    await imageController.toggleVisibility(req, res, mockPool);

    expect(res.status).toHaveBeenCalledWith(500);
  });

});
