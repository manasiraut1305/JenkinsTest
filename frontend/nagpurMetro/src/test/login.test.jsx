import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import AdminLogin from "../Admin/AdminLogin";

// 🔥 Mock API
vi.mock("../Api/Login", () => ({
  loginUser: vi.fn(),
}));

// 🔥 Mock navigate
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { loginUser } from "../Api/Login";

describe("AdminLogin Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // ✅ 1. Render Test
  test("renders login form", () => {
    render(<AdminLogin />);

    expect(screen.getByText("Admin Login")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  // ✅ 2. Input Typing
  test("allows user to type username and password", async () => {
    render(<AdminLogin />);

    const username = screen.getByLabelText("Username");
    const password = screen.getByLabelText("Password");

    await userEvent.type(username, "admin");
    await userEvent.type(password, "1234");

    expect(username).toHaveValue("admin");
    expect(password).toHaveValue("1234");
  });

  // ✅ 3. Successful Login
  test("logs in successfully and navigates", async () => {
    loginUser.mockResolvedValueOnce({
      statusCode: 200,
      data: { name: "Admin" },
    });

    render(<AdminLogin />);

    await userEvent.type(screen.getByLabelText("Username"), "admin");
    await userEvent.type(screen.getByLabelText("Password"), "1234");

    await userEvent.click(screen.getByRole("button", { name: "Login" }));

    // API called
    expect(loginUser).toHaveBeenCalledWith({
      username: "admin",
      password: "1234",
    });

    // localStorage set
    expect(localStorage.getItem("isLoggedIn")).toBe("true");

    // navigation
    expect(mockNavigate).toHaveBeenCalledWith(
      "/admin/dashboard",
      { replace: true }
    );
  });

  // ✅ 4. Invalid Credentials
  test("shows error on invalid login", async () => {
    loginUser.mockResolvedValueOnce({
      statusCode: 401,
      message: "Invalid credentials",
    });

    render(<AdminLogin />);

    await userEvent.type(screen.getByLabelText("Username"), "admin");
    await userEvent.type(screen.getByLabelText("Password"), "wrong");

    await userEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByText("Invalid credentials"))
      .toBeInTheDocument();
  });

  // ✅ 5. API Failure (Catch Block)
  test("shows error when API fails", async () => {
    loginUser.mockRejectedValueOnce(new Error("API Error"));

    render(<AdminLogin />);

    await userEvent.type(screen.getByLabelText("Username"), "admin");
    await userEvent.type(screen.getByLabelText("Password"), "1234");

    await userEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(
      await screen.findByText("Something went wrong. Please try again.")
    ).toBeInTheDocument();
  });

  // ✅ 6. Loading State
  test("shows loading state during login", async () => {
    loginUser.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ statusCode: 200, data: {} }), 500)
        )
    );

    render(<AdminLogin />);

    await userEvent.type(screen.getByLabelText("Username"), "admin");
    await userEvent.type(screen.getByLabelText("Password"), "1234");

    await userEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(screen.getByText("Logging in...")).toBeInTheDocument();
  });

  // ✅ 7. Toggle Password Visibility
  test("toggles password visibility", async () => {
    render(<AdminLogin />);

    const passwordInput = screen.getByLabelText("Password");
    // const toggleIcon = screen.getByRole("img", { hidden: true });
    const toggleIcon = screen.getByLabelText("toggle password");


    // default = password
    expect(passwordInput).toHaveAttribute("type", "password");

    await userEvent.click(toggleIcon);

    expect(passwordInput).toHaveAttribute("type", "text");
  });
});
