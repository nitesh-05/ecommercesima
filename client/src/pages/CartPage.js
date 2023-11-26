import Layout from "../components/Layouts/Layout";
import React, { useState, useEffect } from "react";
import { useCart } from "../context/Cart";
import { useAuth } from "../context/Auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "../axios/axios-config";
import { toast } from "react-toastify";

const CartPage = () => {
  const baseURL = axios.defaults.baseURL;
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [quantity, setQuantity] = useState({}); //----------------------
  const [productAmount, setProductAmount] = useState({}); //----------------------
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

//---------------------new------------------------------------------------
 // Increment the quantity of a product
 const incrementQuantity = (productId) => {
  setQuantity((prevQuantity) => {
    const newQuantity = { ...prevQuantity };
    newQuantity[productId] = (newQuantity[productId] || 0) + 1;
    // Store the updated quantity in local storage
    localStorage.setItem("quantity", JSON.stringify(newQuantity));
    return newQuantity;
  });
};


// Decrement the quantity of a product
const decrementQuantity = (productId) => {
  if (quantity[productId] > 1) {
    setQuantity((prevQuantity) => {
      const newQuantity = { ...prevQuantity };
      newQuantity[productId] = newQuantity[productId] - 1;
      // Store the updated quantity in local storage
      localStorage.setItem("quantity", JSON.stringify(newQuantity));
      return newQuantity;
    });
  }
};
//----------------------------------------------
useEffect(() => {
  // Load stored quantity from local storage
  const storedQuantity = JSON.parse(localStorage.getItem("quantity"));
  if (storedQuantity) {
    setQuantity(storedQuantity);
  }
  // ...
}, []);

//---------------------------------------------------------------------
  //total price
  useEffect(() => {
    const productAmounts = {};
    cart.forEach((product) => {
      productAmounts[product._id] =
        product.price * (quantity[product._id] || 1);
    });
    setProductAmount(productAmounts);
  }, [cart, quantity]);

  // Calculate the total amount for all products in the cart
  const calculateTotalAmount = () => {
    let total = 0;
    cart.forEach((product) => {
      total += productAmount[product._id] || 0;
    });
    return total.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  //detele item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [auth?.token]);

  //handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post("/api/v1/product/braintree/payment", {
        nonce,
        cart,
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully ");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user
                ? "Hello Guest"
                : `Hello  ${auth?.token && auth?.user?.name}`}
              <p className="text-center">
                {cart?.length
                  ? `You Have ${cart.length} items in your cart ${
                      auth?.token ? "" : "please login to checkout !"
                    }`
                  : " Your Cart Is Empty"}
              </p>
            </h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-7  p-0 m-0">
            {cart?.map((p) => (
              <div className="row card flex-row" key={p._id}>
                <div className="col-md-4">
                  <img
                    src={`${baseURL}/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                    width="100%"
                    height={"130px"}
                  />
                </div>
                <div className="col-md-4">
                  <p>{p.name}</p>
                  <p>{p.description.substring(0, 30)}</p>
                  <p>Price : {p.price}</p>
                </div>
                <div className="col-md-4 cart-remove-btn">
                <button
                    style={{
                      margin: "5px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                    className="btn btn-light"
                    onClick={() => removeCartItem(p._id)}
                  >
                    Remove
                  </button>

                
                 
                  <button
                    style={{
                      margin: "5px",
                      boxShadow: "0 6px 6px rgba(0, 0, 0, 0.1)",
                    }}
                    className="btn btn-light"
                    onClick={() => decrementQuantity(p._id)}
                  >
                    -
                  </button>
                  <span>{quantity[p._id] || 0}</span>
                  <button
                    style={{
                      margin: "5px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                    className="btn btn-light"
                    onClick={() => incrementQuantity(p._id)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-5 cart-summary ">
            <h2>Cart Summary</h2>
            <p>Total | Checkout | Payment</p>
            <hr />
            <h4>Total : {calculateTotalAmount ()} </h4>
            {auth?.user?.address ? (
              <>
                <div className="mb-3">
                  <h4>Current Address</h4>
                  <h5>{auth?.user?.address}</h5>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                </div>
              </>
            ) : (
              <div className="mb-3">
                {auth?.token ? (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() =>
                      navigate("/login", {
                        state: "/cart",
                      })
                    }
                  >
                    Plase Login to checkout
                  </button>
                )}
              </div>
            )}
            <div className="mt-2">
              {!clientToken || !auth?.token || !cart?.length ? (
                ""
              ) : (
                <>
                  <DropIn
                    options={{
                      authorization: clientToken,
                      paypal: {
                        flow: "vault",
                      },
                    }}
                    onInstance={(instance) => setInstance(instance)}
                  />

                  <button
                    className="btn btn-primary"
                    onClick={handlePayment}
                    disabled={loading || !instance || !auth?.user?.address}
                  >
                    {loading ? "Processing ...." : "Make Payment"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
