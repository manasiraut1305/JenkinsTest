import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, beforeEach, vi } from "vitest";
import AdminAnnualReport from "../Admin/AdminAnnualReport";

/* ================= MOCKS ================= */

// IMPORTANT: return default for default exports
vi.mock("../Api/AnnualReportGet", () => ({
  default: vi.fn(),
}));

vi.mock("../Api/AnnualReportVisible", () => ({
  default: vi.fn(),
}));

vi.mock("../Api/AnnualReportUpdate", () => ({
  updateAnnualReport: vi.fn(),
}));

vi.mock("../Api/AnnualReportAdd", () => ({
  addAnnualReport: vi.fn(),
}));

/* ================= IMPORTS ================= */

import allAnnualreportFunction from "../Api/AnnualReportGet";
import toggleAnnualReportVisible from "../Api/AnnualReportVisible";
import { updateAnnualReport } from "../Api/AnnualReportUpdate";
import { addAnnualReport } from "../Api/AnnualReportAdd";

/* ================= MOCK DATA ================= */

const mockData = [
  {
    id: 1,
    year: "2023",
    description: "Annual Report 2023",
    reportCoverPage: "/cover1.jpg",
    reportPdf: "/file1.pdf",
    returnReport: "/return1.pdf",
    isDelete: false,
  },
  {
    id: 2,
    year: "2022",
    description: "Annual Report 2022",
    reportCoverPage: null,
    reportPdf: null,
    returnReport: null,
    isDelete: true,
  },
];

describe("AdminAnnualReport Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* ================= FETCH ================= */

  test("renders and fetches annual reports", async () => {
    allAnnualreportFunction.mockResolvedValue(mockData);

    render(<AdminAnnualReport />);

    expect(screen.getByText("Annual Report")).toBeInTheDocument();

    expect(await screen.findByText("2023")).toBeInTheDocument();
    expect(screen.getByText("Annual Report 2023")).toBeInTheDocument();
  });

  test("shows empty state when no data", async () => {
    allAnnualreportFunction.mockResolvedValue([]);

    render(<AdminAnnualReport />);

    expect(
      await screen.findByText("No annual report found")
    ).toBeInTheDocument();
  });

  /* ================= SEARCH ================= */

  test("filters data based on search input", async () => {
    allAnnualreportFunction.mockResolvedValue(mockData);

    render(<AdminAnnualReport />);

    await screen.findByText("2023");

    const searchInput = screen.getByPlaceholderText(
      "Search by year / description..."
    );

    await userEvent.type(searchInput, "2022");

    expect(screen.getByText("2022")).toBeInTheDocument();
    expect(screen.queryByText("2023")).not.toBeInTheDocument();
  });

  /* ================= ADD ================= */

  test("opens add modal and adds report", async () => {
    allAnnualreportFunction.mockResolvedValue(mockData);
    addAnnualReport.mockResolvedValue({});

    render(<AdminAnnualReport />);

    await screen.findByText("2023");

    await userEvent.click(screen.getByRole("button", { name: /\+ add/i }));

    expect(
      screen.getByText("Add Annual Report")
    ).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText("Year"), "2025");
    await userEvent.type(
      screen.getByLabelText("Description"),
      "New Report"
    );

    await userEvent.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => {
      expect(addAnnualReport).toHaveBeenCalled();
    });
  });

  /* ================= EDIT ================= */

  test("opens edit modal and updates report", async () => {
    allAnnualreportFunction.mockResolvedValue(mockData);
    updateAnnualReport.mockResolvedValue({});

    render(<AdminAnnualReport />);

    await screen.findByText("2023");

    await userEvent.click(screen.getAllByText("Edit")[0]);

    expect(
      screen.getByText("Edit Annual Report")
    ).toBeInTheDocument();

    const yearInput = screen.getByLabelText("Year");

    await userEvent.clear(yearInput);
    await userEvent.type(yearInput, "2024");

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(updateAnnualReport).toHaveBeenCalled();
    });
  });

  /* ================= TOGGLE VISIBILITY ================= */

  test("toggles visibility with confirmation modal", async () => {
    allAnnualreportFunction.mockResolvedValue(mockData);
    toggleAnnualReportVisible.mockResolvedValue({});

    render(<AdminAnnualReport />);

    await screen.findByText("2023");

    const checkbox = screen.getAllByRole("checkbox")[0];

    await userEvent.click(checkbox);

    expect(screen.getByText("Confirm")).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "Confirm" })
    );

    await waitFor(() => {
      expect(toggleAnnualReportVisible).toHaveBeenCalled();
    });
  });

  /* ================= PAGINATION ================= */

  test("changes items per page", async () => {
    allAnnualreportFunction.mockResolvedValue(mockData);

    render(<AdminAnnualReport />);

    await screen.findByText("2023");

    const select = screen.getByRole("combobox");

    fireEvent.change(select, { target: { value: "0" } });

    expect(select.value).toBe("0");
  });

  /* ================= FILE INPUT ================= */

  test("handles file upload preview", async () => {
    allAnnualreportFunction.mockResolvedValue(mockData);

    render(<AdminAnnualReport />);

    await screen.findByText("2023");

    await userEvent.click(screen.getByRole("button", { name: /\+ add/i }));

    const file = new File(["dummy"], "test.png", {
      type: "image/png",
    });

    const input = screen.getByLabelText("Cover Image");

    await userEvent.upload(input, file);

    expect(input.files[0]).toBe(file);
  });
});
