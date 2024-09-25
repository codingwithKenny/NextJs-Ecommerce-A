import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Category() {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState([]);
  const [parentCategory, setParentCategory] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get("/api/category").then((response) => {
      setCategory(response.data);
    });
  }

  function saveCategory(e) {
    e.preventDefault();
    const data = { name, parentCategory };
    if (editedCategory) {
      axios
        .put("/api/category", { ...data, _id: editedCategory._id })
        .then(() => {
          setEditedCategory(null);
          setParentCategory("");
          setName("");
          fetchCategories(); // Only call after saving
        });
    } else {
      axios.post("/api/category", data).then(() => {
        setName("");
        setParentCategory("");
        fetchCategories(); // Only call after saving
      });
    }
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category?.parent?._id);
  }

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure you want to delete this category?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/api/category/${id}`)
          .then(() => {
            Swal.fire("Deleted!", "The category has been deleted.", "success");
            // Refetch the categories after deletion
            fetchCategories();
          })
          .catch((error) => {
            console.error("Error deleting category:", error);
            Swal.fire("Error!", "There was a problem deleting the category.", "error");
          });
      }
    });
  };

  return (
    <Layout>
      <h1>Category</h1>
      <label>{editedCategory ? `Edit Category ${editedCategory.name}` : "Create New Category"}</label>
      <form onSubmit={saveCategory} className="flex gap-2">
        <input
          type="text"
          className="mb-0"
          placeholder="Category Name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <select
          className="mb-0"
          value={parentCategory}
          onChange={(e) => setParentCategory(e.target.value)}
        >
          <option value="">Select parent category</option>
          {category?.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-primary py-1">
          Save
        </button>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category Name</td>
            <td>Parent Category</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {category?.map((items) => (
            <tr key={items._id}>
              <td>{items.name}</td>
              <td>{items?.parent?.name}</td>
              <td>
                <button className="btn-primary" onClick={() => editCategory(items)}>
                  Edit
                </button>
                <button onClick={() => handleDelete(items._id)} className="btn-primary">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
