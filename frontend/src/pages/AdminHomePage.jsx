import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAdminProducts } from "../redux/slices/adminProductSlice";
import { fetchAllOrders } from "../redux/slices/orderSlice";

const AdminHomePage = () => {
  const dispatch = useDispatch();

  const {
    products = [],
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.adminProducts || {});

  const {
    orders = [],
    totalOrders = 0,
    totalSales = 0,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.adminOrders || {});

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  if (productsLoading || ordersLoading) {
    return <p className="p-6">Loading...</p>;
  }

  if (productsError) {
    return <p className="p-6 text-red-500">{productsError}</p>;
  }

  if (ordersError) {
    return <p className="p-6 text-red-500">{ordersError}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Revenue</h2>
          <p className="text-2xl">${totalSales}</p>
        </div>

        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Total Orders</h2>
          <p className="text-2xl">{totalOrders}</p>
          <Link to="/admin/orders" className="text-blue-500 hover:underline">
            Manage Orders
          </Link>
        </div>

        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Total Products</h2>
          <p className="text-2xl">{products.length}</p>
          <Link to="/admin/products" className="text-blue-500 hover:underline">
            Manage Products
          </Link>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-3 py-4">Order ID</th>
              <th className="px-3 py-4">User</th>
              <th className="px-3 py-4">Total</th>
              <th className="px-3 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-4">{order._id}</td>
                  <td className="px-3 py-4">
                    {order.user?.name || "Guest"}
                  </td>
                  <td className="px-3 py-4">${order.totalPrice}</td>
                  <td className="px-3 py-4">{order.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHomePage;
