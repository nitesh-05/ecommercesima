
import { hashPassword, comparePassword } from "../helper/authHelper.js";
import userModel from '../models/userModel.js';
import orderModel from "../models/orderModel.js";
import nodemailer from 'nodemailer';
import bcrypt from "bcrypt";

import  jwt from "jsonwebtoken";

export const registerController = async (req, res) => {
 try {
    const { name, email, password, phone, address,answer} = req.body;
    //validations
    if (!name) {
        return res.send({ message: "Name is Required" });
      }
      if (!email) {
        return res.send({ message: "Email is Required" });
      }
      if (!password) {
        return res.send({ message: "Password is Required" });
      }
      if (!phone) {
        return res.send({ message: "Phone no is Required" });
      }
      if (!address) {
        return res.send({ message: "Address is Required" });
      }
      if (!answer) {
        return res.send({ message: "Answer is Required" });
      };
    
      //check user
    const exisitingUser = await userModel.findOne({ email });
    //exisiting user
    if (exisitingUser) {
        return res.status(200).send({
          success: false,
          message: "Already Register please login",
        });
      }
      //register user
      const hashedPassword = await hashPassword(password);
      //save
      const user = await new userModel({
        name,
        email,
        phone,
        address,
        password: hashedPassword,
        answer
      }).save();
  
      res.status(201).send({ 
        success: true,
        message: "User Register Successfully",
        user,
      });
    
 } catch (error) {

    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Resistration",
      error
    });
    
 }
};
//--------------------------------------------------------------

 export const adminregisterController = async (req, res) => {
  try {
    const { name, email, password, phone, address,answer} = req.body;
    //validations
    if (!name) {
        return res.send({ message: "Name is Required" });
      }
      if (!email) {
        return res.send({ message: "Email is Required" });
      }
      if (!password) {
        return res.send({ message: "Password is Required" });
      }
      if (!phone) {
        return res.send({ message: "Phone no is Required" });
      }
      if (!address) {
        return res.send({ message: "Address is Required" });
      }
      if (!answer) {
        return res.send({ message: "Answer is Required" });
      };
    
      //check user
    const exisitingUser = await userModel.findOne({ email });
    //exisiting user
    if (exisitingUser) {
        return res.status(200).send({
          success: false,
          message: "Already Register please login",
        });
      }
      //register user
      const hashedPassword = await hashPassword(password);
      //save
      const user = await new userModel({
        name,
        email,
        phone,
        address,
        password: hashedPassword,
        answer,
        role: 1,
      }).save();

      res.status(201).send({ 
        success: true,
        message: "Admin Registered Successfully",
        user,
      });
    
  } catch (error) {

    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Admin Resistration",
      error
    });
    
  }
};

//POST LOGIN
export const loginController = async (req, res) => {
  try {

    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword (password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",

      });
    }
    //token
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

// send email Link For reset Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:"nicenidhee01@gmail.com",
    pass: "kvuv ddyc ijxq ywma",
  },
});

//---------------------------------------

 export const sendPasswordLink = async (req, res) => {
  const { email } = req.body;
  console.log('Request body:', email);

  if (!email) {
    return res.status(401).json({ status: 401, message: 'Enter Your Email' });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ status: 401, message: 'Invalid user' });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const updatedUser = await userModel.findByIdAndUpdate(
      { _id: user._id },
      { verifytoken: token },
      { new: true }
    );

    if (updatedUser) {
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Sending Email For Password Reset',
        html: `<a href="${process.env.Frontend_URL}/forgot-password/${user.id}/${token}">Click here to reset your password</a>`
        ,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).json({ status: 500, message: 'Email not sent' });
        } else {
          console.log('Email sent', info.response);
          return res.status(201).json({ status: 201, message: 'Email sent successfully' });
        }
      });
    } else {
      return res.status(500).json({ status: 500, message: 'Error setting user token' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 500, message: 'Internal server error' });
  }
};


// //forgotPasswordController
export const forgotPassword = async (req, res) => {
  const { id, token } = req.params;
  try {
    const validUser = await userModel.findOne({ _id: id, verifytoken: token });
    const verifyToken = jwt.verify(token,process.env.JWT_SECRET);
 
    if (validUser && verifyToken._id) {
      res.status(201).json({ status: 201, validUser });
    } else {
      res.status(401).json({ status: 401, message: 'User does not exist' });
    }
  } catch (error) {
    res.status(401).json({ status: 401, error: error.message });
  }
};

// //------------------------------------------------------------------new
export  const updatePassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  console.log(id , token)

  try {
    const validUser = await userModel.findOne({ _id: id });
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    if (validUser && verifyToken._id) {
      const newpassword = await bcrypt.hash(password, 12);
      console.log( password); 
      console.log( newpassword);

      const setNewUserPass = await userModel.findByIdAndUpdate({ _id: id }, { password: newpassword });

      // Note: You don't need to save again after using 'findByIdAndUpdate'

      res.status(201).json({ status: 201, setNewUserPass });
    } else {
      res.status(401).json({ status: 401, message: 'User does not exist' });
    }
  } catch (error) {
    res.status(401).json({ status: 401, error: error.message });
  }
};

// export const forgotPasswordController = async (req, res) => {
//   try {
//     const { email, answer, newPassword } = req.body;
//     if (!email) {
//       res.status(400).send({ message: "Emai is required" });
//     }
//     if (!answer) {
//       res.status(400).send({ message: "answer is required" });
//     }
//     if (!newPassword) {
//       res.status(400).send({ message: "New Password is required" });
//     }
//     //check
//     const user = await userModel.findOne({ email, answer });
//     //validation
//     if (!user) {
//       return res.status(404).send({
//         success: false,
//         message: "Wrong Email Or Answer",
//       });
//     }
//     const hashed = await hashPassword(newPassword);
//     await userModel.findByIdAndUpdate(user._id, { password: hashed });
//     res.status(200).send({
//       success: true,
//       message: "Password Reset Successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Something went wrong",
//       error,
//     });
//   }
// };

//test controller
export const testController = (req, res) => {

  res.send("Protected Routes");}

  //update prfole
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};

//orders
export const getOrdersController = async (req, res) => {
  try {
    // Find orders for the authenticated user (assuming you have implemented authentication middleware)
    const orders = await orderModel
      .find({ buyer: req.user._id }) // Assuming req.user._id is available after authentication
      .populate("products", "-photo")
      .populate("buyer", "name");
   // console.log("orders",orders)
    // Send a success response with the orders
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    // Handle errors and send an error response
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while getting orders",
      error: error.message, // Include the error message for debugging
    });
  }
};
//orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};
//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};

