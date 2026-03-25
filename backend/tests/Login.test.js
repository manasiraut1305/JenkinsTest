const request = require("supertest");
const app = require("../app"); 

const { connectDB } = require("../db");

describe("Login API Tests (Integration - Real DB)", () => {
  let pool;

  /* ================= SETUP ================= */

  beforeAll(async () => {
    pool = await connectDB();
    app.set("db", pool); // ✅ attach DB to app
  });

  afterAll(async () => {
    if (pool) {
      await pool.close();
    }
  });

  /* =====================================================
     LOGIN TEST CASES
  ===================================================== */

  test("should fail if username is missing", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        password: "1234"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Username and password are required");
  });

  test("should fail if password is missing", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        username: "admin"
      });

    expect(res.statusCode).toBe(400);
  });

  test("should fail for invalid credentials", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        username: "wrongUser",
        password: "wrongPass"
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid username or password");
  });

  test("should login successfully with valid credentials", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        username: "ItcraftMetro",
        password: "Itcraft@Metro123"
      });

    expect(res.statusCode).toBe(200);

    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data).toHaveProperty("username");
    expect(res.body.data).toHaveProperty("role");
  });

  test("should not login if user is deleted", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        username: "deletedUser",
        password: "test123"
      });

    expect(res.statusCode).toBe(401);
  });

});
