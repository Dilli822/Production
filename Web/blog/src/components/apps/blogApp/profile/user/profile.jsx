import React, { useState, useEffect } from "react";
import {
  Layout,
  Col,
  Row,
  Card,
  Button,
  Modal,
  Result,
  Input,
  message,
  Alert,
  Spin,
} from "antd";
import AppHeader from "../../header/header";
import AppFooter from "../../footer/footer";
import Forbidden from "../../error/unathorizedAccess";
import { Link } from "react-router-dom";

import {
  EditOutlined,
  CloseOutlined,
  SaveOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;
const { Meta } = Card;

const UserProfile = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [blogData, setBlogData] = useState([]);
  const [blogList, setBlogList] = useState([]);
  const [editImage, setEditImage] = useState(null);
  const [isLogged, setIsLogged] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const [userFullDetails, setUserFullDetails] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [editUsername, setEditUsername] = useState(
    localStorage.getItem("user_name")
  );
  const [editAddress, setEditAddress] = useState(
    localStorage.getItem("address")
  );

  const [editBio, setEditBio] = useState(localStorage.getItem("bio"));
  const [editPhoneNumber, setEditPhoneNumber] = useState(
    localStorage.getItem("phone_number")
  );
  const [address, setAddress] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");

  const [firstUserImg, setFirstUserImg] = useState({ image: "" }); // Initial value with an empty string
  const [newUserImage, setNewUserImage] = useState(null); // Add state for the new user i

  const showModal = () => {
    setIsDeleteModalVisible(true);
  };

  const handleDeleteOk = async () => {
    // Get user id from localStorage
    const userId = localStorage.getItem("user_id");

    try {
      // Make a DELETE request to delete the user account
      const response = await fetch(
        `https://web-production-4cd0.up.railway.app/account/api/user/delete/${userId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        // Successful deletion
        console.log("User account deleted successfully");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("total_blogs_count");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_name");
        localStorage.removeItem("phone_number");
        localStorage.removeItem("address");
        localStorage.removeItem("user_email");
        localStorage.removeItem("bio");
        localStorage.removeItem("user_image");

        // Redirect to the specified path after successful deletion
        window.location.href = "/";
      } else {
        // Handle error
        console.error("Error deleting user account");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setIsDeleteModalVisible(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };

  const updateImage = async () => {
    try {
      // Get user id from localStorage
      const userId = localStorage.getItem("user_id");

      // Create a FormData object to handle the image upload
      const formData = new FormData();
      formData.append("image", editImage);

      // Make a PATCH request to update user details with the image
      const imageResponse = await fetch(
        `https://web-production-4cd0.up.railway.app/account/api/userdetails/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: formData,
        }
      );

      if (imageResponse.ok) {
        // Successful image update
        console.log("User details updated successfully with image");

        // Assuming the server responds with the new image URL or identifier
        const responseData = await imageResponse.json();

        // Store the image URL or identifier in localStorage
        localStorage.setItem("user_image", responseData.image);

        // Update the state immediately with the new image
        setFirstUserImg({ image: responseData.image });
        // Show success message
        message.success("Profile updated successfully");
      } else {
        // Handle image update error
        console.error("Error updating user details with image");
        message.error("Something went wrong.try again");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [editNewImage, setEditNewImage] = useState(null);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    setEditNewImage(file);
    setEditImage(file);

    // Update the img src immediately after selecting the image
    const reader = new FileReader();
    reader.onload = (event) => {
      document.getElementById("profile-image").src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleUserDetailEdit = () => {
    setIsEdit(true);
  };

  const handleUserDetailCancel = () => {
    setIsEdit(false);
    setEditUsername(localStorage.getItem("user_name") || "");
    setEditAddress(localStorage.getItem("address") || "");
    setEditAddress(localStorage.getItem("phone_number") || "");
    setEditAddress(localStorage.getItem("bio") || "");
    setEditImage(null); // Reset image
  };

  const fetchImageData = async () => {
    try {
      const response = await fetch("https://web-production-4cd0.up.railway.app/account/api/userdetails/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const data = await response.json();
      console.log(data);
      setIsLogged(true);
      console.log(data.image);
      setFirstUserImg({ image: data.image });
      setBio(data.bio);
      setAddress(data.address);
      setPhoneNumber(data.phone_number);
      localStorage.setItem("user_image", data.image);
      localStorage.setItem("address", data.address);
      localStorage.setItem("phone_number", data.phone_number);
      localStorage.setItem("bio", data.bio);
      // if (data.length > 0) {
      // } else
      if (response.status === 401) {
        setIsLogged(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateUsername = async () => {
    try {
      // Get user id from localStorage
      const userId = localStorage.getItem("user_id");

      // Make a PUT request to update the username
      const response = await fetch(
        `https://web-production-4cd0.up.railway.app/account/api/user/update/${userId}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: editUsername,
          }),
        }
      );

      if (response.ok) {
        // Successful update
        console.log("Username updated successfully");
        // Save the updated username in localStorage
        localStorage.setItem("user_name", editUsername);
      }
      // Handle error
      console.error("Error updating username");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateUserDetails = async () => {
    try {
      // Get user id from localStorage
      const userId = localStorage.getItem("user_id");

      // Make a PUT request to update the username
      const response = await fetch(
        `https://web-production-4cd0.up.railway.app/account/api/userdetails/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: editAddress,
            phone_number: editPhoneNumber,
            bio: editBio,
          }),
        }
      );

      if (response.ok) {
        // Successful update
        console.log("Username updated successfully");

        // Save the updated username in localStorage
        localStorage.setItem("user_name", editUsername);
        localStorage.setItem("phone_number", editPhoneNumber);
        localStorage.setItem("address", editAddress);
        localStorage.setItem("bio", editBio);
      }
      // Handle error
      console.error("Error updating username");
    } catch (e) {
      console.error("Error:", e);
    }
  };

  // SAVE BUTTON FOR EDIT
  const handleUserDetailSave = async () => {
    // Check if there are changes in the username
    if (editUsername !== localStorage.getItem("user_name")) {
      await updateUsername();
    }

    // Check if there is an image to upload
    if (editImage) {
      await updateImage();
    }
    if (
      editAddress !== localStorage.getItem("address") ||
      editBio !== localStorage.getItem("bio") ||
      editPhoneNumber !== localStorage.getItem("phone_number")
    ) {
      await updateUserDetails();
    }
    // Set isEdit to false after saving
    setIsEdit(false);
  };

  // Trigger the image update when editImage changes
  useEffect(() => {
    handleUserDetailSave();
  }, []);

  useEffect(
    () => {
      const fetchBlogData = async () => {
        try {
          const response = await fetch(
            "https://web-production-4cd0.up.railway.app/blog/api/user-blog-list/",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );

          const data = await response.json();
          setInitLoading(false);
          setBlogList(data);
          setIsLogged(true);
          if (data.length > 0) {
            // console.log(data);
          } else if (response.status === 401) {
            setIsLogged(false);
          }
        } catch (error) {
          console.error(error);
          setError("Something went wrong! Failed to fetch data");
        } finally {
          setIsLoading(false);
        }
      };
      fetchImageData();
      fetchBlogData(); // Call the async function when the component mounts
      if (editImage) {
        updateImage();
      }
      // cleanup function if needed
      return () => {
        // cleanup logic
      };
    },
    [],
    [editImage],
    [editAddress],
    [editPhoneNumber],
    [editBio]
  );

  const userFirstImg = localStorage.getItem("user_image");
  console.log(userFirstImg);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 64px)", // Subtract the height of the header
        }}
      >
        <Spin size="large" />
      </div>
    );
  }
  if (!isLogged) {
    return <Forbidden />;
  }

  return (
    <>
      <AppHeader />

      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 64px)", // Subtract the height of the header
          }}
        >
          <Spin size="large" />
        </div>
      ) : error ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 64px)", // Subtract the height of the header
          }}
        >
          <Alert message={error} type="error" />
        </div>
      ) : (
        <div>
          <Layout className="ant-container">
            <br />

            <Row>
              <Col md={10} style={{ margin: "1%" }}>
                <Card
                  hoverable
                  style={{}}
                  cover={
                    <img
                      alt="example"
                      src={userFirstImg || ""}
                      style={{ padding: "15px", maxWidth: "100%" }}
                    />
                  }
                >
                  {isEdit ? (
                    <>
                      <label>
                        <b>Username</b>
                      </label>
                      <Input
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        style={{
                          border: "1px solid #000",
                          minHeight: "35px",
                          background: "none",
                        }}
                        placeholder="Write your blog content here."
                      />
                      <label>
                        <b>address</b>
                      </label>
                      <Input
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        style={{
                          border: "1px solid #000",
                          minHeight: "35px",
                          background: "none",
                        }}
                        placeholder="Address"
                      />
                      <label>
                        <b>Profile Image</b>
                      </label>
                      <img
                        id="profile-image" // Added id to the img tag for easy reference
                        src={localStorage.getItem("user_image")}
                        alt=""
                        style={{ maxWidth: "100%" }}
                      />
                      <br />
                      <Input
                        type="file"
                        onChange={(e) => handleProfileImageChange(e)}
                        style={{
                          border: "1px solid #000",
                          minHeight: "35px",
                          background: "none",
                        }}
                      />
                      <label>
                        <b>Contact</b>
                      </label>
                      <Input
                        value={editPhoneNumber}
                        onChange={(e) => setEditPhoneNumber(e.target.value)}
                        style={{
                          border: "1px solid #000",
                          minHeight: "35px",
                          background: "none",
                        }}
                        placeholder="Address"
                      />
                      <label>
                        <b>bio</b>
                      </label>
                      <Input
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        style={{
                          border: "1px solid #000",
                          minHeight: "35px",
                          background: "none",
                        }}
                        placeholder="Address"
                      />
                      <div>
                        <br />
                      </div>
                      <Button
                        icon={<CloseOutlined />}
                        onClick={handleUserDetailCancel}
                      >
                        Cancel
                      </Button>
                      &nbsp; &nbsp;
                      <Button
                        icon={<SaveOutlined />}
                        onClick={handleUserDetailSave}
                      >
                        Save
                      </Button>
                      <br />
                    </>
                  ) : (
                    <Meta
                      title={localStorage.getItem("user_name") || "username"}
                      description={
                        <>
                          <p>
                            <strong>Email:</strong>{" "}
                            {localStorage.getItem("user_email")}
                          </p>

                          <p>
                            <strong>bio: </strong> {localStorage.getItem("bio")}
                          </p>

                          <p>
                            <strong>address: </strong>{" "}
                            {localStorage.getItem("address")}
                          </p>

                          <p>
                            <strong>Contact: </strong>{" "}
                            {localStorage.getItem("phone_number")}
                          </p>
                        </>
                      }
                    />
                  )}
                  <br />
                  <Button
                    icon={<EditOutlined />}
                    onClick={handleUserDetailEdit}
                  >
                    Edit
                  </Button>
                  &nbsp; &nbsp;
                  <Button danger icon={<DeleteOutlined />} onClick={showModal}>
                    Delete Account
                  </Button>
                  {isEdit ? <div></div> : <div></div>}
                  <Modal
                    title="Confirm Delete"
                    visible={isDeleteModalVisible}
                    onOk={handleDeleteOk}
                    onCancel={handleDeleteCancel}
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                  >
                    <p>Are you sure you want to delete your account?</p>
                    <p>This action cannot be undone.</p>
                  </Modal>
                </Card>
              </Col>

              <Col
                md={13}
                xs={24}
                style={{
                  background: "#fff",
                  margin: "1%",
                  borderRadius: "8px",
                }}
              >
                <Row gutter={24} style={{ padding: "0 4%", margin: 0 }}>
                  <br />

                  <Col
                    md={24}
                    xs={23}
                    style={{ padding: "0 0 3% 0", margin: 0 }}
                  >
                    <h2>
                      {" "}
                      Blogs {blogList.length === 0 ? 0 : blogList.length}
                    </h2>
                    {blogList.length === 0 ? (
                      <Result
                        status="404"
                        title="No Blogs Found"
                        subTitle="You haven't published any blogs yet."
                      />
                    ) : (
                      <Row
                        gutter={24}
                        style={{
                          height: "auto",
                          overflow: "auto",
                          margin: "0",
                        }}
                      >
                        {blogList.map((item) => (
                          <Col
                            key={item.id}
                            md={12}
                            xs={24}
                            style={{
                              height: "auto",
                              overflow: "hidden",
                              border: "1px solid #d9d9d9",
                              borderRadius: "5px",
                              marginTop: "2%",
                              padding: "1%",
                              boxShadow: "0 2px 0 rgba(0, 0, 0, 0.02);",
                            }}
                          >
                            <div style={{ textAlign: "left" }}>
                              <img
                                src={item.image}
                                alt="Blog"
                                style={{
                                  width: "100%",
                                  height: "",
                                  marginBottom: 8,
                                }}
                              />
                            </div>
                            <div style={{ textAlign: "left" }}>
                              &nbsp;
                              <Link
                                to={`/details/${item.id}`}
                                style={{
                                  fontWeight: "normal",
                                  alignItems: "start",
                                  color: "#000",
                                }}
                              >
                                {item.title}
                              </Link>
                            </div>
                            <div style={{ marginTop: 8 }}>
                              <Link to={`/blogs`}>View Blogs</Link>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    )}

                    {blogList.length > 0 && (
                      <div style={{ textAlign: "center", marginTop: "1%" }}>
                        <hr />
                        <Button
                          onClick={() => (window.location.href = "/blogs")}
                        >
                          View More
                        </Button>
                      </div>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Layout>
        </div>
      )}
      <br />

      <AppFooter />
    </>
  );
};

export default UserProfile;
