import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Layouts/Prices";
import { useCart } from "../context/Cart";
import axios from "../axios/axios-config";
import { toast } from "react-toastify";
import Layout from "./../components/Layouts/Layout";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/Homepage.css";
import { useAuth } from "../context/Auth";
import { css } from '@emotion/react';
import { BeatLoader } from 'react-spinners';


const HomePage = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  const baseURL = axios.defaults.baseURL;
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const override = css`
    display: block;
    margin: 0 auto;
  `;


  //get all cat
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);
  //get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //getTOtal COunt
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);
  //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // filter by cat
  // const handleFilter = (value, id) => {
  //   setLoading(true);
  //   let all = [...checked];
  //   if (value) {
  //     all.push(id);
  //   } else {
  //     all = all.filter((c) => c !== id);
  //   }
  //   setChecked(all);
  //   setLoading(false);
  // };
  const handleFilter = async (value, id) => {
    setLoading(true);
    try {
      await new Promise((resolve) => {
        setTimeout(resolve, 3000); // Simulates a 3-second delay
      });
      let all = [...checked];
      if (value) {
        all.push(id);
      } else {
        all = all.filter((c) => c !== id);
      }
      setChecked(all);
    } catch (error) {
      console.error('Error:', error);
    } finally { 
     setLoading(false);
    }
  };
  
  useEffect(() => {
    // console.log("==================================", radio.length);
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  //get filterd product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout title={"ALl Products - Best offers "}>
      {/* banner image */}
      <img
        src="/images/banner.png"
        className="banner-img"
        alt="bannerimage"
        width={"100%"}
      />
      {/* banner image */}
      <div className="container-fluid row mt-3 home-page">
        <div className="col-md-3 filters">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column" >
          {categories?.map((c) => (
           <div key={c._id}>
              <Checkbox onChange={(e) => handleFilter(e.target.checked, c._id)}>
                {c.name}
              </Checkbox>
              </div>
                     ))}
            </div>
   
          {/* price filter */}
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  {console.log("p._id", p._id)}
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>
        </div>
        <div className="col-md-9 ">
          <h1 className="text-center">All Products</h1>
          {loading && (
          <div className="spinner">
            <BeatLoader color={'#123abc'} css={override} loading={loading} size={15} />
          </div>
        )}
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <div className="card m-2" key={p._id}>
                {console.log("p._id --", p._id)}

                <img
                  src={`${baseURL}/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <div className="card-name-price">
                    <h5 className="card-title">{p.name}</h5>
                    <h5 className="card-title card-price">
                      {p.price.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </h5>
                  </div>
                  <p className="card-text " 
                    style={{ height: "1.5em", overflow: "hidden" }}>
                    {p.description.substring(0, 60)}
                  </p>
                  <div className="card-name-price">
                    <button
                      className="btn btn-info ms-1"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>

                    {auth?.user?.role !== 1 && (
                    <button
                      className={`btn btn-dark ms-1`}
                      
                      onClick={() => {
                        if (auth?.user?.role === 1) {
                          // Role is 1, you can add custom logic here or show a message.
                          // Example: alert("Role 1 is not allowed to perform this action");
                          return;
                        }

                        if (cart.find((item) => item._id === p._id)) {
                          // The product is already in the cart, navigate to the cart.
                          navigate("/cart");
                        } else {
                          // The product is not in the cart, add it to the cart.
                          setCart([...cart, p]);
                          localStorage.setItem(
                            "cart",
                            JSON.stringify([...cart, p])
                          );
                          toast.success("Item Added to Cart");
                        }
                      }}
                 
                    >
                      {cart.find((item) => item._id === p._id)
                        ? "GO TO CART"
                        : "ADD TO CART"}
                    </button>
                    )}

                    {/* <button
                      className="btn btn-dark ms-1 mb-0"
                      onClick={() => {
                        if (cart.find((item) => item._id === p._id)) {
                          // The product is already in the cart, navigate to the cart.
                          navigate("/cart");
                        } else {
                          // The product is not in the cart, add it to the cart.
                          setCart([...cart, p]);
                          localStorage.setItem(
                            "cart",
                            JSON.stringify([...cart, p])
                          );
                          toast.success("Item Added to Cart");
                        }
                      }}
                    >
                      {cart.find((item) => item._id === p._id)
                        ? "GO TO CART"
                        : "ADD TO CART"}
                    </button> */}
                    {/* <button
                      className="btn btn-dark ms-1"
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p])
                        );
                        toast.success("Item Added to cart");
                      }}
                    >
                      ADD TO CART
                    </button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="m-2 p-3">
            {products && products.length < total && (
               <button
              className="btn loadmore"
              onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                 }}
            >
              {loading ? (
                "Loading ..."
              ) : (
                <>
                  {" "}
                  Loadmore <AiOutlineReload />
                </>
              )}
            </button>
              
              

              // <button
              //   className="btn loadmore"
              //   onClick={(e) => {
              //     e.preventDefault();
              //     setPage(page + 1);
              //   }}
              // >
              //   {loading ? (
              //     "Loading ..."
              //   ) : (
              //     <>
              //       {" "}
              //       Loadmore <AiOutlineReload />
              //     </>
              //   )}
              // </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
