import React, { useState } from "react";
import AdminMenu from "./../../components/Layouts/AdminMenu";
import Layout from "./../../components/Layouts/Layout";
import axios from "../../axios/axios-config";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Users = () => {
  const [userList, setUserList] = useState();
  const sendTiwiloSms = async (title, description) => {
    try {
      const { data } = await axios.post("/api/v1/tiwlio/sms", {
        title: title,
        description: description,
      });
      console.log("data", data);
      if (data?.success) {
        //  Swal.fire(
        //   `Title: ${title}, Description: ${description}`,
        //   "",
        //   "success"
        // );
        toast.success("Sms Send Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  const openSmsModel = () => {
    Swal.fire({
      title: "Enter Title and Description for the SMS",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: "Don't save",
      html:
        '<input id="title" class="swal2-input" placeholder="Title">' +
        '<input id="description" class="swal2-input" placeholder="Description">',
      preConfirm: () => {
        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        return {
          title: title,
          description: description,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { title, description } = result.value;

        sendTiwiloSms(title, description);

        // Swal.fire(
        //   `Title: ${title}, Description: ${description}`,
        //   "",
        //   "success"
        // );
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  const verifyPhone = async () => {
    try {
      const { data } = await axios.post("/api/v1/tiwlio/verifyPhone", {
        phoneNo: "+912222222222",
      });
      console.log("data", data);
      if (data?.success) {
        Swal.fire(JSON.stringify(data.message));
        // toast.success("Sms Send Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  const getTiwlioUserList = async () => {
    try {
      const { data } = await axios.get("/api/v1/tiwlio/userList");
      console.log("data", data);
      if (data?.success) {
        setUserList(data.message);
        Swal.fire(JSON.stringify(data.message));
        // toast.success("Sms Send Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  return (
    <Layout title={"Dashboard - All Users"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>All Users</h1>

            <button
              type="button"
              className="btn btn-success"
              onClick={openSmsModel}
            >
              Send SMS
            </button>

            <button
              type="button"
              className="btn btn-info"
              onClick={verifyPhone}
            >
              Add number
            </button>

            <button
              type="button"
              className="btn btn-danger"
              onClick={getTiwlioUserList}
            >
              Get user list
            </button>
            {userList && (
              <ul>
                {userList.map((user, index) => (
                  <li key={index}>{user.phoneNumber}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
