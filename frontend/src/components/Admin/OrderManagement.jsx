import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllOrders, updateOrderStatus } from "../../redux/slices/adminOrderSlice";



const OrderManagement = () => {    
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error} = useSelector((state) => state.adminOrders);

  useEffect(() => {
    if (!user || user.role !=="admin"){
      navigate("/");
    } else {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, user, navigate]);

  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderStatus({id: orderId, status }));
  };

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}...</p>

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>

      <table className="overflow-x-auto shadow-md sm:rounded-lg w-full">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th className="py-3 px-4 border-b">Order ID</th>
            <th className="py-3 px-4 border-b">Customer</th>
            <th className="py-3 px-4 border-b">Total Price</th>
            <th className="py-3 px-4 border-b">Status</th>
            <th className="py-3 px-4 border-b">Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 cursor-pointer">

                {/* Order ID */}
                <td className="p-4 border-b text-center">
                  <div className="flex flex-col items-center">
                    {/* <span className="text-gray-500 text-sm">ID</span> */}
                    <span className="font-medium">{order._id}</span>
                  </div>
                </td>

                {/* Customer */}
                <td className="p-4 border-b text-center">
                  <div className="flex flex-col items-center">
                    {/* <span className="text-gray-500 text-sm">Customer</span> */}
                    <span className="font-medium">{order.user.name}</span>
                  </div>
                </td>

                {/* Total Price */}
                <td className="p-4 border-b text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-medium">${order.totalPrice.toFixed(2)}</span>
                  </div>
                </td>

                {/* Status */}
                <td className="p-4 border-b text-center">
                  <div className="flex flex-col items-center">
                    {/* <span className="text-gray-500 text-sm">Status</span> */}
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </td>

                {/* Actions */}
                <td className="p-4 border-b text-center">
                  <div className="flex flex-col items-center gap-2">
                    {/* <span className="text-gray-500 text-sm">Actions</span> */}
                    <button
                      onClick={() => handleStatusChange(order._id, "Delivered")}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Mark as Delivered
                    </button>
                  </div>
                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-4 text-center text-gray-500 border-b">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagement;
