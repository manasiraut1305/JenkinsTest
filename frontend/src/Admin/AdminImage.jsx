import React, { useEffect, useMemo, useState } from "react";
import { Modal, Table, Button, Form, Image, Pagination } from "react-bootstrap";
import allImageFunction from "../Api/ImageGet";
import { addImageFunction } from "../Api/ImageAdd";
import { updateImage } from "../Api/ImageUpdate";
import { toggleVisibility } from "../Api/ImageToggle";

const API_URL = import.meta.env.VITE_DOTNET_API_URL;
const PAGE_WINDOW = 5;

const AdminImage = () => {
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageWindowStart, setPageWindowStart] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("add");
  const [currentId, setCurrentId] = useState(null);

  const [showToggleModal, setShowToggleModal] = useState(false);
  const [toggleId, setToggleId] = useState(null);

  const [form, setForm] = useState({
    img_title: "",
    showonHome: 0,
    imageFile: null,
    preview: "",
  });

  /* ---------- FETCH ---------- */
  const fetchImages = async () => {
    try {
      const data = await allImageFunction();
      setImages(Array.isArray(data) ? data : []);
    } catch (error) {
      setImages([]);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  /* ---------- SEARCH ---------- */
  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q
      ? images.filter((img) =>
          (img.img_title || "").toLowerCase().includes(q)
        )
      : images;
  }, [images, search]);

  /* ---------- PAGINATION ---------- */
  const totalPages =
    itemsPerPage === 0
      ? 1
      : Math.ceil(filteredData.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
    setPageWindowStart(1);
  }, [itemsPerPage, search]);

  const startIndex =
    itemsPerPage === 0 ? 0 : (currentPage - 1) * itemsPerPage;

  const pageData =
    itemsPerPage === 0
      ? filteredData
      : filteredData.slice(startIndex, startIndex + itemsPerPage);

  const windowEnd = Math.min(pageWindowStart + PAGE_WINDOW - 1, totalPages);

  const visiblePages = Array.from(
    { length: windowEnd - pageWindowStart + 1 },
    (_, i) => pageWindowStart + i
  );

  /* ---------- HANDLERS ---------- */

  const openAdd = () => {
    setMode("add");
    setCurrentId(null);
    setForm({
      img_title: "",
      showonHome: 0,
      imageFile: null,
      preview: "",
    });
    setShowModal(true);
  };

  const openEdit = (img) => {
    setMode("edit");
    setCurrentId(img.img_id);
    setForm({
      img_title: img.img_title || "",
      showonHome: img.showonHome || 0,
      imageFile: null,
      preview: img.img_src,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { type, files, value, id, checked } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        setForm((prev) => ({
          ...prev,
          imageFile: file,
          preview: URL.createObjectURL(file),
        }));
      }
    } else if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [id]: checked ? 1 : 0,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("img_title", form.img_title);
      formData.append("showonHome", form.showonHome);

      if (form.imageFile) {
        formData.append("image", form.imageFile);
      }

      if (mode === "add") {
        await addImageFunction(formData);
      } else {
        await updateImage(currentId, formData);
      }

      await fetchImages();
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleVisible = async (id) => {
    await toggleVisibility(id);
    await fetchImages();
  };

  /* ---------- UI ---------- */

  return (
    <div className="p-3">
      <h4>Image Gallery</h4>

      <Form.Control
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Button onClick={openAdd}>+ Add Image</Button>

      <Table>
        <tbody>
          {pageData.length === 0 ? (
            <tr>
              <td>No data</td>
            </tr>
          ) : (
            pageData.map((img, idx) => (
              <tr key={img.img_id}>
                <td>{img.img_title}</td>

                <td>
                  <Button onClick={() => openEdit(img)}>Edit</Button>
                </td>

                <td>
                  <Form.Check
                    type="checkbox"
                    checked={img.visible === 0}
                    onChange={() => {
                      setToggleId(img.img_id);
                      setShowToggleModal(true);
                    }}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Title>
          {mode === "add" ? "Add New Image" : "Edit Image"}
        </Modal.Title>

        <Form>
          <Form.Group controlId="img_title">
            <Form.Label htmlFor="img_title">Image Title</Form.Label>
            <Form.Control
              id="img_title"
              value={form.img_title}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="imageFile">
            <Form.Label htmlFor="imageFile">Image File</Form.Label>
            <Form.Control
              id="imageFile"
              type="file"
              aria-label="Image File"
              onChange={handleChange}
            />
          </Form.Group>
        </Form>

        <Button onClick={handleSubmit}>
          {mode === "add" ? "Add" : "Save"}
        </Button>
      </Modal>

      {/* TOGGLE MODAL */}
      <Modal show={showToggleModal}>
        <Modal.Body>Confirm toggle visibility?</Modal.Body>

        <Button
          onClick={async () => {
            await handleToggleVisible(toggleId);
            setShowToggleModal(false);
          }}
        >
          Confirm Toggle
        </Button>
      </Modal>
    </div>
  );
};

export default AdminImage;
