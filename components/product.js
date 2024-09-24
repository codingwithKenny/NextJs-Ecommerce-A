import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Spinner from "./spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  title: existingTitle,
  _id,
  description: existingDescription,
  price: existingPrice,
  images: existingImage,
}) {
  const [title, setTitle] = useState(existingTitle || ""); // Use existing data if available
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImage || []);
  const [goBackToProduct, setGoBackToProduct] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function saveProduct(e) {
    e.preventDefault();
    const data = { title, description, price, images };
    console.log(data);

    try {
      if (_id) {
        // update
        await axios.put("/api/products", { ...data, _id });
      } else {
        // create
        const response = await axios.post("/api/products", data); // Save the product
        console.log(response);
      }

      setGoBackToProduct(true);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  }

  if (goBackToProduct) {
    router.push("/products"); // Redirect back to the products page after saving
  }

  async function uploadImages(e) {
    console.log(e);
    const files = e.target.files;
    if (files?.length > 0) {
      setLoading(true);
      const data = new FormData();
      Array.from(files).forEach((file) => data.append("file", file));

      const res = await axios.post("/api/upload", data);
      console.log(res.data);

      setImages((oldImage) => {
        return [...oldImage, ...res.data.links];
      });
      setLoading(false);
    }
   
  }
  function updateImageOrder(newImages) {
    setImages(newImages)
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product Name</label>
      <input
        type="text"
        placeholder="product"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label>photos</label>
      <div className="mb-2 flex flex-wrap gap-2">
        <ReactSortable list={images} setList={updateImageOrder} className="flex flex-wrap gap-2">
          {!!images.length &&
            images.map((link) => (
              <div key={link} className="h-24">
                <img src={link} />
              </div>
            ))}
        </ReactSortable>
        {loading && (
          <div className="w-24 h-24 bg-gray-200">
            <Spinner className="text-center" />
          </div>
        )}
        <label className="w-24 h-24 bg-gray-200 cursor-pointer flex flex-col items-center justify-center rounded text-gray-400 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          Upload
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
      </div>
      <label>Description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label>Price</label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
