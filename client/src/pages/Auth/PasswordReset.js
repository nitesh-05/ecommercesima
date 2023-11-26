import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Layout from "../../components/Layouts/Layout.js";
import axios from '../../axios/axios-config.js';

const PasswordReset= () => {
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");

    const setVal = (e) => {
        setEmail(e.target.value)
    }

    const sendLink = async (e) => {
        e.preventDefault();

        if (email === "") {
            toast.error("Email is required!", {
                position: "top-center"
            });
        } else if (!email.includes("@")) {
            toast.warning("Include @ in your email!", {
                position: "top-center"
            });
        } else {
            try {
                const response = await axios.post("/api/v1/auth/sendpasswordlink", { email }, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (response.status === 201) {
                    setEmail("");
                    setMessage(true);
                } else {
                    toast.error("Invalid User", {
                        position: "top-center"
                    });
                }
            } catch (error) {
                console.error("Error:", error);
                toast.error("An error occurred while sending the link", {
                    position: "top-center"
                });
            }
        }
    }


    return (
        <>
     <Layout title={"Forgot Password - Ecommerce APP"}>
      <div className="form-container ">
        <form>
          <h4 className="title">Enter Your Email</h4>
          {message ? <p style={{ color: "green", fontWeight: "bold" }}>pasword reset link send Succsfully in Your Email</p> : ""}
          <div className="mb-3">
          <label htmlFor="email"><h5>Email</h5></label>
          <input
                type="email"
                className="form-control"
                value={email}
                onChange={setVal}
                name="email"
                id="email"
               placeholder="Enter Your Email Address"/>                                    
          </div>

          <button type="submit" className="btn btn-primary" onClick={sendLink} style={{width:"100%"}}>
          Send
          </button>
        </form>
      
      </div>
    
    </Layout>
        </>
    );
};

export default PasswordReset;
