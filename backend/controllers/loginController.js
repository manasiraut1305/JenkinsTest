exports.loginUser = async (req, res) => {
  try {
    const pool = req.app.get("db"); // ✅ FIX HERE

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        statusCode: 400,
        message: "Username and password are required"
      });
    }

    const request = pool.request();
    request.input("username", username);
    request.input("password", password);

    const result = await request.query(`
      SELECT id, username, role
      FROM users
      WHERE username = @username 
      AND password_hash = @password
      AND isDelete = 1
    `);

    if (result.recordset.length === 0) {
      return res.status(401).json({
        statusCode: 401,
        message: "Invalid username or password"
      });
    }

    const user = result.recordset[0];

    return res.status(200).json({
      statusCode: 200,
      message: "Login successful",
      data: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    });
  }
};
