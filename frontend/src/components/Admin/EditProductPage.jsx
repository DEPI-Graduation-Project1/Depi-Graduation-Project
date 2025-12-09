import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductDetails, updateProduct } from "../../redux/slices/productsSlice";
import axios from "axios";

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const {selectedProduct, loading, error} = useSelector((state) => state.products);



  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: "0",
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: [],
    material: "",
    gender: "",
    images: []
    
  });

  const [uploading, setUploading] = useState(false); // Image uploading state
  
  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      setProduct(selectedProduct);
    }
  }, [selectedProduct]);

  // تحديث البيانات العادية
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // رفع الصور
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image" , file);

    try{
      setUploading(true);
      const {data} = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },

        }
      );
      setProduct((prevData) => ({
        ...prevData,
        images: [...prevData.images, { url: data.imageUrl, altText: "" }],
      }));
      setUploading(false);  
    } catch (error) {
      console.error(error);
      setUploading(false);
    }

  };

  // حفظ التغييرات
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProduct({ id, product}));
    navigate("/admin/products");
  };
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>

      <form onSubmit={handleSubmit}>

        {/* Product Name */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Product Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            rows="4"
          ></textarea>
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Count In Stock */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Count In Stock</label>
          <input
            type="number"
            name="countInStock"
            value={product.countInStock}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* SKU */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">SKU</label>
          <input
            type="text"
            name="sku"
            value={product.sku}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Sizes */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Sizes (comma separated)</label>
          <input
            type="text"
            name="sizes"
            value={product.sizes.join(",")}
            onChange={(e) =>
              setProduct({
                ...product,
                sizes: e.target.value.split(",").map((s) => s.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Colors */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Colors (comma separated)</label>
          <input
            type="text"
            name="colors"
            value={product.colors.join(",")}
            onChange={(e) =>
              setProduct({
                ...product,
                colors: e.target.value.split(",").map((c) => c.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Upload Image</label>
          <input
            type="file"
            onChange={handleImageUpload}
          />
          {uploading && <p>Uploading image...</p>}
          <div className="mt-4 flex gap-4">
            {product.images.map((img, index) => (
              <div key={index}>
                <img
                  src={img.url}
                  alt="Product Image"
                  className="w-24 h-24 object-cover border rounded"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2  rounded-md hover:bg-green-600 transition-colors"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
