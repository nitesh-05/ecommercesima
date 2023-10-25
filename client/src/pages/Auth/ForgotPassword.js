import React, { useEffect, useState } from 'react';
import Layout from "../../components/Layouts/Layout.js";
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import "../../styles/AuthStyles.css";

// const ForgotPassword = () => {
//   const { id, token } = useParams();
//   const history = useNavigate();
//   const [data2, setData] = useState(false);
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');

//   const userValid = async () => {
//     const res = await fetch(`/forgot-password/${id}/${token}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     const data = await res.json();

//     if (data.status === 201) {
//       console.log('user valid');
//     } else {
//       history('*');
//     }
//   };

//   const setval = (e) => {
//     setPassword(e.target.value);
//   };

//   const sendpassword = async (e) => {
//     e.preventDefault();

//     if (password === '') {
//       toast.error('Password is required!', {
//         position: 'top-center',
//       });
//     } else if (password.length < 6) {
//       toast.error('Password must be at least 6 characters!', {
//         position: 'top-center',
//       });
//     } else {
//       const res = await fetch(`/${id}/${token}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ password }),
//       });

//       const data = await res.json();

//       if (data.status === 201) {
//         setPassword('');
//         setMessage(true);
//       } else {
//         toast.error('Token expired, generate a new link', {
//           position: 'top-center',
//         });
//       }
//     }
//   };

//   useEffect(() => {
//     userValid();
//     setTimeout(() => {
//       setData(true);
//     }, 3000);
//   }, []);
const ForgotPassword = () => {
  const { id, token } = useParams();
  const history = useNavigate();
  const [data2, setData] = useState(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const userValid = async () => {
    try {
      const res = await fetch(`/api/v1/auth/forgotpassword/${id}/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // debugger;
      if (!res.ok) {
        throw new Error('User validation failed');
      }

      const data = await res.json();

      console.log(data); // Handle the response data as needed

      // You might want to redirect or display a message based on the response data
      if (data.status === 201) {
        console.log('User is valid');
      } else {
        history('*');
      }
    } catch (error) {
      console.error('Error validating user:', error);
      toast.error('Error validating user', {
        position: 'top-center',
      });
    }
  };

  const setval = (e) => {
    setPassword(e.target.value);
  };

  const sendpassword = async (e) => {
    e.preventDefault();



    if (password === '') {
      toast.error('Password is required!', {
        position: 'top-center',
      });
      return;
    } else if (password.length < 6) {
      toast.error('Password must be at least 6 characters!', {
        position: 'top-center',
      });
      return;
    }

    try {
      const res = await fetch(`/api/v1/auth/updatePassword/${id}/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error('Password update failed');
      }

      if (data.status === 201) {
        setPassword('');
        setMessage(true);
      } else {
        toast.error('Token expired, generate a new link', {
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Error updating password', {
        position: 'top-center',
      });
    }
  };

  useEffect(() => {
    userValid();
    setTimeout(() => {
      setData(true);
    }, 3000);
  }, []);

  return (
    <>
      <Layout title={"Forgot Password - Ecommerce APP"}>
      {data2 ? (
        <>
            <div className="form-container ">
                     <form>
                        {message ? (
                          <p style={{ color: 'green', fontWeight: 'bold' }}>Password Successfully Updated </p>
                        ) : (
                          ''
                        )}
                        <div className="mb-3">
                          <label htmlFor="password" className="form-label">
                         <h4>Enter Your NEW Password</h4> 
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={setval}
                            id="password"
                            placeholder="Enter Your New Password"
                          />
                        </div>

                        <button type="button" className="btn btn-primary" onClick={sendpassword}>
                          Send
                        </button>
                        <p className="mt-3 text-center">
                       <NavLink to="/">Home</NavLink>
                       </p>
                      </form>
                    
                      <ToastContainer />
                    </div>
        </>
      ) : (
        <div className="d-flex justify-content-center align-items-center vh-100">
          Loading... &nbsp;
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      </Layout>
    </>
  );
};

export default ForgotPassword