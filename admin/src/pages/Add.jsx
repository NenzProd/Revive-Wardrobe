import axios from "axios";
import { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import Select from "react-select";

export const backendUrls = import.meta.env.VITE_BACKEND_URL;

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Ethnic Elegance");
  const [type, setType] = useState("Stitched");
  const [bestseller, setBestseller] = useState(false);
  const [stock, setStock] = useState(0);
  const [slug, setSlug] = useState("");
  const [sizes, setSizes] = useState([]);
  const [fabric, setFabric] = useState("Lawn");

  const sizeOptions = [
    { value: "XS", label: "XS" },
    { value: "S", label: "S" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
    { value: "XL", label: "XL" },
  ];

  useEffect(() => {
    // Auto-generate slug from name
    if (name) {
      setSlug(
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    } else {
      setSlug("");
    }
  }, [name]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("type", type);
      formData.append("bestseller", bestseller);
      formData.append("stock", stock);
      formData.append("slug", slug);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("fabric", fabric);

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
        setStock(0);
        setSlug("");
        setSizes([]);
        setFabric("Lawn");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          <label htmlFor="image1">
            <img
              className="w-25"
              src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
              alt=""
            />
            <input
              onChange={(e) => setImage1(e.target.files[0])}
              type="file"
              id="image1"
              hidden
            />
          </label>

          <label htmlFor="image2">
            <img
              className="w-25"
              src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
              alt=""
            />
            <input
              onChange={(e) => setImage2(e.target.files[0])}
              type="file"
              id="image2"
              hidden
            />
          </label>

          <label htmlFor="image3">
            <img
              className="w-25"
              src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
              alt=""
            />
            <input
              onChange={(e) => setImage3(e.target.files[0])}
              type="file"
              id="image3"
              hidden
            />
          </label>

          <label htmlFor="image4">
            <img
              className="w-25"
              src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
              alt=""
            />
            <input
              onChange={(e) => setImage4(e.target.files[0])}
              type="file"
              id="image4"
              hidden
            />
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2 "
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2 "
          type="text"
          placeholder="Type context here"
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2"
          >
            <option value="Ethnic Elegance">Ethnic Elegance</option>
            <option value="Graceful Abayas">Graceful Abayas</option>
            <option value="Intimate Collection">Intimate Collection</option>
            <option value="Stitching Services">Stitching Services</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Type</p>
          <select
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2"
          >
            <option value="Stitched">Stitched</option>
            <option value="Unstitched">Unstitched</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Fabric</p>
          <select
            onChange={(e) => setFabric(e.target.value)}
            value={fabric}
            className="w-full px-3 py-2"
            required
          >
            <option value="Lawn">Lawn</option>
            <option value="Chiffon">Chiffon</option>
            <option value="Silk">Silk</option>
            <option value="Cotton">Cotton</option>
            <option value="Organza">Organza</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
      <div>
          <p className="mb-2">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full max-w-[500px] px-3 py-2"
            type="Number"
            placeholder="25"
          />
        </div>
        <div>
          <p className="mb-2">Stock</p>
          <input
            onChange={(e) => setStock(e.target.value)}
            value={stock}
            className="w-full max-w-[500px] px-3 py-2"
            type="number"
            min="0"
            placeholder="Stock quantity"
            required
          />
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to Best Seller
        </label>
      </div>

      <div className="w-full">
        <p className="mb-2">Slug</p>
        <input
          onChange={(e) => setSlug(e.target.value)}
          value={slug}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="slug-for-product"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Sizes</p>
        <Select
          isMulti
          options={sizeOptions}
          value={sizeOptions.filter((opt) => sizes.includes(opt.value))}
          onChange={(selected) => setSizes(selected.map((opt) => opt.value))}
          className="w-full max-w-[500px]"
          classNamePrefix="react-select"
          placeholder="Select sizes..."
        />
      </div>

      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
        ADD
      </button>
    </form>
  );
};

Add.propTypes = {
  token: PropTypes.string.isRequired,
};

export default Add;
