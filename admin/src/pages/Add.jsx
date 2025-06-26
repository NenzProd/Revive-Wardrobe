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
  const [slug, setSlug] = useState("");
  const [fabric, setFabric] = useState("Lawn");
  const [variants, setVariants] = useState([
    {
      sku: '',
      purchase_price: '',
      retail_price: '',
      discount: 0,
      weight_unit: 'Kg',
      filter_value: '',
      min_order_quantity: 1,
      stock: 0
    }
  ]);

  const sizeOptions = [
    { value: "XS", label: "XS" },
    { value: "S", label: "S" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
    { value: "XL", label: "XL" },
  ];

  // Helper to generate unique SKU per product and size
  function generateSku (slug, filterValue) {
    if (!slug || !filterValue) return ''
    return `${slug.toUpperCase()}-${filterValue}`
  }

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
    // No longer auto-generate SKUs here, will do per variant below
  }, [name]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Ensure each variant has a unique SKU before submitting
      const variantsWithSku = variants.map((variant) => ({
        ...variant,
        sku: generateSku(slug, variant.filter_value)
      }))

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("type", type);
      formData.append("bestseller", bestseller);
      formData.append("slug", slug);
      formData.append("fabric", fabric);
      formData.append("variants", JSON.stringify(variantsWithSku));

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
        setSlug("");
        setFabric("Lawn");
        setBestseller(false);
        setVariants([
          {
            sku: '',
            purchase_price: '',
            retail_price: '',
            discount: 0,
            weight_unit: 'Kg',
            filter_value: '',
            min_order_quantity: 1,
            stock: 0
          }
        ]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-800">Add New Product</h2>
      
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col w-full gap-6"
      >
        {/* Image Upload Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-3">Product Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label 
              htmlFor="image1"
              className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white aspect-square overflow-hidden"
            >
              <img
                className="w-full h-full object-cover"
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

            <label 
              htmlFor="image2"
              className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white aspect-square overflow-hidden"
            >
              <img
                className="w-full h-full object-cover"
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

            <label 
              htmlFor="image3"
              className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white aspect-square overflow-hidden"
            >
              <img
                className="w-full h-full object-cover"
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

            <label 
              htmlFor="image4"
              className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white aspect-square overflow-hidden"
            >
              <img
                className="w-full h-full object-cover"
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

        {/* Basic Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-3">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                id="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="w-full px-3 py-2 bg-white"
                type="text"
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                id="slug"
                onChange={(e) => setSlug(e.target.value)}
                value={slug}
                className="w-full px-3 py-2 bg-white"
                type="text"
                placeholder="product-url-slug"
                required
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
            <textarea
              id="description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="w-full px-3 py-2 bg-white min-h-[100px]"
              placeholder="Enter product description"
              required
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-3">Product Details</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                id="category"
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white"
              >
                <option value="Ethnic Elegance">Ethnic Elegance</option>
                <option value="Graceful Abayas">Graceful Abayas</option>
                <option value="Intimate Collection">Intimate Collection</option>
                <option value="Stitching Services">Stitching Services</option>
              </select>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                id="type"
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 bg-white"
              >
                <option value="Stitched">Stitched</option>
                <option value="Unstitched">Unstitched</option>
              </select>
            </div>

            <div>
              <label htmlFor="fabric" className="block text-sm font-medium text-gray-700 mb-1">Fabric</label>
              <select
                id="fabric"
                onChange={(e) => setFabric(e.target.value)}
                value={fabric}
                className="w-full px-3 py-2 bg-white"
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {/* Price removed as per requirements */}
          </div>
          
          {/* Variants Section */}
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Variants</h4>
            {variants.map((variant, idx) => (
              <div key={idx} className="border rounded-lg p-4 mb-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                    <input type="text" className="w-full px-3 py-2 bg-gray-50" value={generateSku(slug, variant.filter_value)} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
                    <input type="number" className="w-full px-3 py-2 bg-gray-50" value={variant.purchase_price} onChange={e => {
                      const v = [...variants]
                      v[idx].purchase_price = e.target.value
                      setVariants(v)
                    }} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Retail Price</label>
                    <input type="number" className="w-full px-3 py-2 bg-gray-50" value={variant.retail_price} onChange={e => {
                      const v = [...variants]
                      v[idx].retail_price = e.target.value
                      setVariants(v)
                    }} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                    <input type="number" className="w-full px-3 py-2 bg-gray-50" value={variant.discount} onChange={e => {
                      const v = [...variants]
                      v[idx].discount = e.target.value
                      setVariants(v)
                    }} min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight Unit</label>
                    <select className="w-full px-3 py-2 bg-gray-50" value={variant.weight_unit} onChange={e => {
                      const v = [...variants]
                      v[idx].weight_unit = e.target.value
                      setVariants(v)
                    }}>
                      <option value="Kg">Kg</option>
                      <option value="Lb">Lb</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Quantity</label>
                    <input type="number" className="w-full px-3 py-2 bg-gray-50" value={variant.min_order_quantity} onChange={e => {
                      const v = [...variants]
                      v[idx].min_order_quantity = e.target.value
                      setVariants(v)
                    }} min="1" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter Value (e.g. Size)</label>
                    <Select
                      isMulti={false}
                      options={sizeOptions}
                      value={sizeOptions.find(opt => opt.value === variant.filter_value) || null}
                      onChange={selected => {
                        const v = [...variants]
                        v[idx].filter_value = selected ? selected.value : ''
                        setVariants(v)
                      }}
                      className="w-full bg-white"
                      classNamePrefix="react-select"
                      placeholder="Select filter value..."
                    />
                  </div>
                  <div className="flex items-end">
                    {variants.length > 1 && (
                      <button type="button" className="text-red-600 font-medium ml-2" onClick={() => {
                        setVariants(variants.filter((_, i) => i !== idx))
                      }}>Remove</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="mt-2 px-4 py-2 bg-gray-200 rounded" onClick={() => setVariants([...variants, {
              sku: '',
              purchase_price: '',
              retail_price: '',
              discount: 0,
              weight_unit: 'Kg',
              filter_value: '',
              min_order_quantity: 1,
              stock: 0
            }])}>
              + Add Variant
            </button>
          </div>
          
          <div className="mt-4 flex items-center">
            <input
              id="bestseller"
              onChange={() => setBestseller((prev) => !prev)}
              checked={bestseller}
              type="checkbox"
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label className="ml-2 text-sm text-gray-700 cursor-pointer" htmlFor="bestseller">
              Add to Best Seller
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          className="mt-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-medium rounded-md hover:shadow-lg transition-all w-full sm:w-auto self-start"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

Add.propTypes = {
  token: PropTypes.string.isRequired,
};

export default Add;
