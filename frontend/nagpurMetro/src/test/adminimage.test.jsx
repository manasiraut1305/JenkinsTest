import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminImage from "../Admin/AdminImage";
import { vi } from "vitest";

// ✅ mocks
vi.mock("../Api/ImageGet", () => ({
  default: vi.fn(),
}));
vi.mock("../Api/ImageAdd", () => ({
  addImageFunction: vi.fn(),
}));
vi.mock("../Api/ImageUpdate", () => ({
  updateImage: vi.fn(),
}));
vi.mock("../Api/ImageToggle", () => ({
  toggleVisibility: vi.fn(),
}));

import allImageFunction from "../Api/ImageGet";
import { addImageFunction } from "../Api/ImageAdd";
import { updateImage } from "../Api/ImageUpdate";
import { toggleVisibility } from "../Api/ImageToggle";

const mockData = [
  { img_id: 1, img_title: "Image 1", visible: 0 },
  { img_id: 2, img_title: "Image 2", visible: 1 },
];

describe("AdminImage", () => {
  beforeEach(() => vi.clearAllMocks());

  test("fetches and displays images", async () => {
    allImageFunction.mockResolvedValue(mockData);

    render(<AdminImage />);

    await waitFor(() => {
      expect(screen.getByText("Image 1")).toBeInTheDocument();
    });
  });

  test("search filters images", async () => {
    allImageFunction.mockResolvedValue(mockData);

    render(<AdminImage />);

    await screen.findByText("Image 1");

    await userEvent.type(
      screen.getByPlaceholderText("Search by title..."),
      "2"
    );

    expect(screen.getByText("Image 2")).toBeInTheDocument();
  });

  test("add image flow", async () => {
    allImageFunction.mockResolvedValue(mockData);
    addImageFunction.mockResolvedValue({});

    render(<AdminImage />);

    await screen.findByText("Image 1");

    await userEvent.click(screen.getByText("+ Add Image"));

    await userEvent.type(screen.getByLabelText("Image Title"), "New");

    await userEvent.click(screen.getByText("Add"));

    await waitFor(() => {
      expect(addImageFunction).toHaveBeenCalled();
    });
  });

  test("edit image flow", async () => {
    allImageFunction.mockResolvedValue(mockData);
    updateImage.mockResolvedValue({});

    render(<AdminImage />);

    await screen.findByText("Image 1");

    await userEvent.click(screen.getAllByText("Edit")[0]);

    await userEvent.clear(screen.getByLabelText("Image Title"));
    await userEvent.type(screen.getByLabelText("Image Title"), "Updated");

    await userEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(updateImage).toHaveBeenCalled();
    });
  });

  test("toggle visibility", async () => {
    allImageFunction.mockResolvedValue(mockData);
    toggleVisibility.mockResolvedValue({});

    render(<AdminImage />);

    await screen.findByText("Image 1");

    const checkbox = screen.getAllByRole("checkbox")[0];

    await userEvent.click(checkbox);

    await userEvent.click(screen.getByText("Confirm Toggle"));

    await waitFor(() => {
      expect(toggleVisibility).toHaveBeenCalled();
    });
  });

  test("file upload works", async () => {
    allImageFunction.mockResolvedValue(mockData);

    render(<AdminImage />);

    await screen.findByText("Image 1");

    await userEvent.click(screen.getByText("+ Add Image"));

    const file = new File(["dummy"], "test.png", { type: "image/png" });

    const input = screen.getByLabelText("Image File");

    await userEvent.upload(input, file);

    expect(input.files[0]).toBe(file);
  });
});
