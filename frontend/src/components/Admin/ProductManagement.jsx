import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, fetchAdminProducts } from "../../redux/slices/adminProductSlice";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.adminProducts
  );

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);
  

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Product Management</h2>

      <table className="overflow-x-auto shadow-md sm:rounded-lg w-full">
        <thead className="bg-gray-100 text-xs uppercase font-medium text-gray-700">
          <tr>
            <th className="py-3 px-4 border-b">Name</th>
            <th className="py-3 px-4 border-b">Price</th>
            <th className="py-3 px-4 border-b">SKU</th>
            <th className="py-3 px-4 border-b">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50 cursor-pointer">

                {/* Name */}
                <td className="p-4 border-b text-center">
                  <div className="flex flex-col items-center">
                    {/* <span className="text-gray-500 text-sm">Name</span> */}
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>

                {/* Price */}
                <td className="p-4 border-b text-center">
                  <div className="flex flex-col items-center">
                    {/* <span className="text-gray-500 text-sm">Price</span> */}
                    <span className="font-medium">${product.price}</span>
                  </div>
                </td>

                {/* SKU */}
                <td className="p-4 border-b text-center">
                  <div className="flex flex-col items-center">
                    {/* <span className="text-gray-500 text-sm">SKU</span> */}
                    <span className="font-medium">{product.sku}</span>
                  </div>
                </td>

                {/* Actions */}
                <td className="p-4 border-b text-center">
                  <div className="flex flex-col items-center gap-2">
                    {/* <span className="text-gray-500 text-sm">Actions</span> */}
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/products/${product._id}/edit`}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-4 text-center text-gray-500 border-b">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;
