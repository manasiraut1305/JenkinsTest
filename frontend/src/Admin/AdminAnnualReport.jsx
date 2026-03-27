import React, { useEffect, useMemo, useState } from "react";
import { Modal, Table, Button, Form, Image, Pagination } from "react-bootstrap";
import allAnnualreportFunction from "../Api/AnnualReportGet";
import toggleAnnualReportVisible from "../Api/AnnualReportVisible";
import { updateAnnualReport } from "../Api/AnnualReportUpdate";
import { addAnnualReport } from "../Api/AnnualReportAdd";

const PAGE_WINDOW = 5;

const AdminAnnualReport = () => {
  const [annualReport, setAnnualReport] = useState([]);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageWindowStart, setPageWindowStart] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("add"); // "add" | "edit"
  const [currentId, setCurrentId] = useState(null);

  const [showVisibleModal, setShowVisibleModal] = useState(false);
  const [toggleId, setToggleId] = useState(null);

  const [form, setForm] = useState({
    year: "",
    description: "",
    reportCoverPage: null,
    reportPdf: null,
    returnReport: null,
    coverPreview: "",
  });

  /* ---------- FETCH ---------- */
  const fetchAnnualReport = async () => {
    try {
      const data = await allAnnualreportFunction();
      setAnnualReport(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching annualReport:", error);
      setAnnualReport([]);
    }
  };

  useEffect(() => {
    fetchAnnualReport();
  }, []);

  /* ---------- SEARCH ---------- */
  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return annualReport;

    return annualReport.filter((m) => {
      const year = String(m.year ?? "").toLowerCase();
      const desc = String(m.description ?? "").toLowerCase();
      return year.includes(q) || desc.includes(q);
    });
  }, [annualReport, search]);

  /* ---------- PAGINATION ---------- */
  const totalPages =
    itemsPerPage === 0 ? 1 : Math.ceil(filteredData.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
    setPageWindowStart(1);
  }, [itemsPerPage, search]);

  const startIndex = itemsPerPage === 0 ? 0 : (currentPage - 1) * itemsPerPage;

  const pageData =
    itemsPerPage === 0
      ? filteredData
      : filteredData.slice(startIndex, startIndex + itemsPerPage);

  const windowEnd = Math.min(pageWindowStart + PAGE_WINDOW - 1, totalPages);
  const visiblePages = [];
  for (let i = pageWindowStart; i <= windowEnd; i++) visiblePages.push(i);

  /* ---------- HELPERS ---------- */
  const baseUrl = import.meta.env.VITE_DOTNET_API_URL || "";

  const getIsDelete = (m) => {
    if (typeof m.isDelete !== "undefined") return Boolean(m.isDelete);
    if (typeof m.isdelete !== "undefined") return Boolean(m.isdelete);
    return false;
  };

  const isVisible = (m) => !getIsDelete(m);

  /* ---------- HANDLERS ---------- */
  const openAdd = () => {
    setMode("add");
    setCurrentId(null);
    setForm({
      year: "",
      description: "",
      reportCoverPage: null,
      reportPdf: null,
      returnReport: null,
      coverPreview: "",
    });
    setShowModal(true);
  };


  const openEdit = (m) => {
    setMode("edit");
    setCurrentId(m.id);

    setForm({
      year: m.year ?? "",
      description: m.description ?? "",
      reportCoverPage: null, // file will be selected if user changes
      reportPdf: null,  
      returnReport: null,  
      coverPreview: m.report_coverpage ? `${baseUrl}${m.report_coverpage}` : "",
      existingCoverPath: m.report_coverpage ?? "",
      existingPdfPath: m.report_pdf ?? "",
      existingreturnReport: m.returnReport ?? "",
    });

    setShowModal(true);
  };


  const handleTextChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({
      ...prev,
      reportCoverPage: file,
      coverPreview: URL.createObjectURL(file),
    }));
  };

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, reportPdf: file }));
  };
  const handleAnnualreturnChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, returnReport: file }));
  };

  const handleSubmit = async () => {
    try {
      console.log("FORM STATE:", form);

      if (mode === "add") await addAnnualReport(form);
      else {
        await updateAnnualReport(form, currentId);
        console.log(form, currentId)
      }

      await fetchAnnualReport();
      setShowModal(false);
    } catch (e) {
      console.error(e);
    }
  };



  const handleToggleVisible = async (id) => {
    try {
      await toggleAnnualReportVisible(id);
      await fetchAnnualReport();
    } catch (err) {
      console.error("Visibility toggle error:", err);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h4 className="mb-0">Annual Report</h4>
        <div className="d-flex gap-2">
          <Form.Control
            size="sm"
            style={{ width: 280 }}
            placeholder="Search by year / description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="success" size="sm" onClick={openAdd}>
            + Add
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div style={{ maxHeight: "720px", overflowY: "auto" }}>
        <Table
          striped
          bordered
          hover
          responsive
          className="table-layout-auto mt-3"
        >
          <thead>
            <tr>
              <th>#</th>
              <th style={{ width: "18%" }}>Year</th>
              <th style={{ width: "35%" }}>Description</th>
              <th>Cover</th>
              <th>PDF</th>
              <th>Annual Report Return</th>
              <th>Actions</th>
              <th className="text-center">Visible</th>
            </tr>
          </thead>

          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">
                  No annual report found
                </td>
              </tr>
            ) : (
              pageData.map((m, idx) => (
                <tr key={m.id}>
                  <td>{startIndex + idx + 1}</td>
                  <td>{m.year}</td>
                  <td>{m.description}</td>

                  <td>
                    {m.reportCoverPage ? (
                      <Image
                        src={`${baseUrl}${m.reportCoverPage}`}
                        thumbnail
                        style={{ width: 90, height: 55, objectFit: "cover" }}
                      />
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>
                    {m.reportPdf ? (
                      <a
                        href={`${baseUrl}${m.reportPdf}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View PDF
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    {m.returnReport ? (
                      <a
                        href={`${baseUrl}${m.returnReport}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View PDF
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>
                    <Button size="sm" onClick={() => openEdit(m)}>
                      Edit
                    </Button>
                  </td>

                  <td className="text-center">
                    <Form.Check
                      type="checkbox"
                      checked={isVisible(m)}
                      onChange={() => {
                        setToggleId(m.id);
                        setShowVisibleModal(true);
                      }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="d-flex justify-content-between align-items-center my-3">
        <Form.Select
          size="sm"
          style={{ width: 90 }}
          value={itemsPerPage}
          onChange={(e) => {
            const value = e.target.value === "0" ? 0 : Number(e.target.value);
            setItemsPerPage(value);
          }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
          <option value={50}>50</option>
          <option value={0}>All</option>
        </Form.Select>

        {itemsPerPage !== 0 && totalPages > 1 && (
          <Pagination className="mb-0">
            <Pagination.Prev
              disabled={pageWindowStart === 1}
              onClick={() => {
                const newStart = Math.max(1, pageWindowStart - PAGE_WINDOW);
                setPageWindowStart(newStart);
                setCurrentPage(newStart);
              }}
            />
            {visiblePages.map((page) => (
              <Pagination.Item
                key={page}
                active={currentPage === page}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={windowEnd === totalPages}
              onClick={() => {
                const newStart = Math.min(
                  Math.max(1, totalPages - PAGE_WINDOW + 1),
                  pageWindowStart + PAGE_WINDOW,
                );
                setPageWindowStart(newStart);
                setCurrentPage(newStart);
              }}
            />
          </Pagination>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      /* ---------- ADD / EDIT MODAL ---------- */
<Modal show={showModal} onHide={() => setShowModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>
      {mode === "add" ? "Add Annual Report" : "Edit Annual Report"}
    </Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <Form>
      <Form.Group className="mb-2">
        <Form.Label htmlFor="year">Year</Form.Label>
        <Form.Control
          id="year"
          value={form.year}
          onChange={handleTextChange}
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label htmlFor="description">Description</Form.Label>
        <Form.Control
          id="description"
          value={form.description}
          onChange={handleTextChange}
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label htmlFor="coverImage">Cover Image</Form.Label>
        <Form.Control
          id="coverImage"
          type="file"
          accept="image/*"
          onChange={handleCoverChange}
        />
        {form.coverPreview && (
          <Image
            src={form.coverPreview}
            style={{ width: 160, height: 95, objectFit: "cover" }}
            className="mt-2"
          />
        )}
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label htmlFor="reportPdf">PDF</Form.Label>
        <Form.Control
          id="reportPdf"
          type="file"
          accept="application/pdf"
          onChange={handlePdfChange}
        />
        {form.reportPdf && (
          <div className="mt-2">Selected: {form.reportPdf.name}</div>
        )}
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label htmlFor="returnReport">Annual Return Pdf</Form.Label>
        <Form.Control
          id="returnReport"
          type="file"
          accept="application/pdf"
          onChange={handleAnnualreturnChange}
        />
        {form.returnReport && (
          <div className="mt-2">Selected: {form.returnReport.name}</div>
        )}
      </Form.Group>
    </Form>
  </Modal.Body>

  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Close
    </Button>
    <Button variant="primary" onClick={handleSubmit}>
      {mode === "add" ? "Add" : "Save"}
    </Button>
  </Modal.Footer>
</Modal>

{/* ---------- VISIBILITY MODAL ---------- */}
<Modal
  show={showVisibleModal}
  onHide={() => setShowVisibleModal(false)}
  centered
>
  <Modal.Header closeButton>
    {/* ✅ FIX: Avoid duplicate "Confirm" */}
    <Modal.Title>Visibility Confirmation</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    Change visibility of this annual report?
  </Modal.Body>

  <Modal.Footer>
    <Button
      variant="secondary"
      onClick={() => setShowVisibleModal(false)}
    >
      Cancel
    </Button>

    <Button
      variant="danger"
      onClick={async () => {
        await handleToggleVisible(toggleId);
        setShowVisibleModal(false);
      }}
    >
      Confirm
    </Button>
  </Modal.Footer>
</Modal>


      
    </div>
  );
};

export default AdminAnnualReport;
