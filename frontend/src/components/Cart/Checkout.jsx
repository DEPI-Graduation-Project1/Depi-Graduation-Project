import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PayPalButton from "./PayPalButton";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { createCheckout } from "../../redux/slices/checkoutSlice";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState(null);

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  // ✅ تأكد إن السلة مش فاضية
  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  // ✅ إنشاء Checkout
  const handleCreateCheckout = async (e) => {
    e.preventDefault();

    if (cart && cart.products.length > 0) {
      const res = await dispatch(
        createCheckout({
          checkoutItems: cart.products,
          shippingAddress,
          paymentMethod: "PayPal",
          totalPrice: cart.totalPrice,
        })
      );

      if (res.payload && res.payload._id) {
        setCheckoutId(res.payload._id);
      }
    }
  };

  // ✅ عند نجاح الدفع
  const handlePaymentSuccess = async (details) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/pay`,
        { paymentStatus: "paid", paymentDetails: details },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      if (response.status === 200) {
        await handleFinalizeCheckout(checkoutId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ إنهاء الطلب
  const handleFinalizeCheckout = async (checkoutId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      if (response.status === 200) {
        navigate("/order-confirmation");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ حالات التحميل والخطأ
  if (loading) return <p>Loading cart ...</p>;
  if (error) return <p>Error loading cart: {error}</p>;
  if (!cart || !cart.products || cart.products.length === 0) {
    return <p>Your cart is empty. Please add items to proceed to checkout.</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">

      {/* Left Section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>

        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-4">Contact Details</h3>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={user ? user.email : ""}
              className="w-full p-2 border rounded"
              disabled
            />
          </div>

          <h3 className="text-lg mb-4">Delivery</h3>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <input
              placeholder="First Name"
              value={shippingAddress.firstName}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, firstName: e.target.value })
              }
              className="p-2 border rounded"
              required
            />

            <input
              placeholder="Last Name"
              value={shippingAddress.lastName}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, lastName: e.target.value })
              }
              className="p-2 border rounded"
              required
            />
          </div>

          <input
            placeholder="Address"
            value={shippingAddress.address}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, address: e.target.value })
            }
            className="w-full p-2 border rounded mb-4"
            required
          />

          <div className="mb-4 grid grid-cols-2 gap-4">
            <input
              placeholder="City"
              value={shippingAddress.city}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, city: e.target.value })
              }
              className="p-2 border rounded"
              required
            />

            <input
              placeholder="Postal Code"
              value={shippingAddress.postalCode}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
              }
              className="p-2 border rounded"
              required
            />
          </div>

          <input
            placeholder="Country"
            value={shippingAddress.country}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, country: e.target.value })
            }
            className="w-full p-2 border rounded mb-4"
            required
          />

          <input
            placeholder="Phone"
            value={shippingAddress.phone}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, phone: e.target.value })
            }
            className="w-full p-2 border rounded mb-6"
            required
          />

          {!checkoutId ? (
            <button type="submit" className="w-full bg-black text-white py-3 rounded">
              Continue to Payment
            </button>
          ) : (
            <>
              <h3 className="text-lg mb-4">Pay with PayPal</h3>
              <PayPalButton
                amount={cart.totalPrice}
                onSuccess={handlePaymentSuccess}
                onError={() => alert("Payment failed. Try again.")}
              />
            </>
          )}
        </form>
      </div>

      {/* Right Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Order Summary</h3>

        {cart.products.map((product, index) => (
          <div key={index} className="flex justify-between py-2 border-b">
            <p>{product.name}</p>
            <p>${product.price?.toLocaleString()}</p>
          </div>
        ))}

        <div className="flex justify-between mt-4 text-lg">
          <p>Total</p>
          <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
