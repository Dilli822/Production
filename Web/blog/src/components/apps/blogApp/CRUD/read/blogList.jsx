import React, { useEffect, useState } from "react";
import {
  Button,
  Layout,
  List,
  Typography,
  Collapse,
  Modal,
  Col,
  Input,
  Spin,
  Upload,
  Alert,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FolderViewOutlined,
  ExclamationCircleOutlined,
  DeleteRowOutlined,
} from "@ant-design/icons";

import AppHeader from "../../header/header";
import AppFooter from "../../footer/footer";

import { UploadOutlined, SaveOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Title } = Typography;

const { Panel } = Collapse;
const { confirm } = Modal;

const BlogList = () => {
  const [initLoading, setInitLoading] = useState(false);
  const [data, setData] = useState([]);
  const [list, setList] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editHeader, setEditHeader] = useState("");
  const [editParagraph, setEditParagraph] = useState("");
  const [editImageFile, setEditImageFile] = useState(null); // State to track the edited image file
  const [editLoading, setEditLoading] = useState(false);
  const [clickedBlogImage, setClickedBlogImage] = useState(null);

  // Declare id state variable
  const [id, setId] = useState(null);

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this blog?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      onOk() {
        handleDelete(id);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://web-production-4cd0.up.railway.app/blog/api/user-blog-crud/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log(`Blog with ID ${id} deleted successfully`);

      // Update the state to trigger a re-render without the deleted item
      setList((prevList) => prevList.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const handleView = (id) => {
    // Handle view logic, e.g., navigate to details page
    window.location.pathname = `/details/${id}`;
    console.log(`View blog with ID ${id}`);
  };

  const fetchData = async () => {
    try {
      // Fetch data from your API with authorization header
      const response = await fetch(
        "https://web-production-4cd0.up.railway.app/blog/api/user-blog-list/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      // Sort the data in ascending order based on the date
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
      setIsLoading(false);
      setInitLoading(false);
      setData(result);
      setList(result);
    } catch (error) {
      setIsLoading(true);
      setError(error);
      console.error("Error fetching data:", error);
    }
  };

  const handleEditHeaderChange = (e) => {
    setEditHeader(e.target.value);
  };

  const handleEditParagraphChange = (e) => {
    setEditParagraph(e.target.value);
  };

  const handleEditImageChange = (file) => {
    // Handle changes to the edited image file
    setEditImageFile(file);
  };

  const handleEditPostBlog = async (id) => {
    // Show the edit modal
    setEditModalVisible(true);

    try {
      const response = await fetch(
        `https://web-production-4cd0.up.railway.app/blog/api/user-blog-crud/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Populate the fields with the fetched data
      setEditHeader(data.title);
      setEditParagraph(data.description);
      // Set the image URL of the clicked blog post
      setClickedBlogImage(data.image);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle errors or show a message to the user
    }
  };

  const submitEditChange = async () => {
    try {
      const formData = new FormData();
      formData.append("title", editHeader);
      formData.append("description", editParagraph);

      // Check if there's a new image file to upload
      if (editImageFile) {
        formData.append("image", editImageFile);
      }

      const response = await fetch(
        `https://web-production-4cd0.up.railway.app/blog/api/user-blog-crud/${id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Get the updated data from the response
      const updatedData = await response.json();

      // Update the local state with the edited values
      setData((prevData) => {
        const newData = prevData.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              title: updatedData.title,
              description: updatedData.description,
              image: updatedData.image,
            };
          }
          return item;
        });
        return newData;
      });
      message.success("Blog Updated Successfully");
      // Close the modal
      setEditModalVisible(false);

      // Trigger re-fetch of data to update the list after a successful edit
      fetchData();
    } catch (error) {
      console.error("Error updating blog:", error);
      // Handle errors or show a message to the user
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <AppHeader />
      <Layout style={{ padding: "0 10%" }}>
        <Title>
          {" "}
          Blogs List <hr />
        </Title>

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
            <List
              className="demo-loadmore-list"
              loading={initLoading}
              itemLayout="horizontal"
              dataSource={list}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => {
                        setId(item.id); // Set the id before calling handleEditPostBlog
                        handleEditPostBlog(item.id);
                      }}
                    >
                      Edit
                    </Button>,
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => showDeleteConfirm(item.id)}
                    >
                      Delete
                    </Button>,

                    <Button
                      icon={<FolderViewOutlined />}
                      onClick={() => handleView(item.id)}
                    >
                      View
                    </Button>,
                  ]}
                >
                  <div
                    style={{
                      display: "block",
                      overflow: "hidden",
                    }}
                  >
                    {/* <img src="{item.src}" alt="" srcset="" /> */}
                    <img
                      src={item.image}
                      alt=""
                      srcset=""
                      style={{ width: "50px" }}
                    />
                    <h2> {item.title}</h2>
                    <p>
                      {item.description.split(" ").slice(0, 50).join(" ") +
                        (item.description.split(" ").length > 50 ? " ..." : "")}
                    </p>{" "}
                  </div>
                </List.Item>
              )}
            />

            <Modal
              title="Edit Blog"
              visible={editModalVisible}
              onCancel={() => setEditModalVisible(false)}
              footer={null} // No footer for simplicity, you can customize it
              width="70%"
            >
              <Layout style={{ padding: "3%" }}>
                <Col>
                  <h3>Title: </h3>
                  <Input
                    placeholder="Enter Blog Title"
                    value={editHeader}
                    onChange={handleEditHeaderChange}
                    style={{
                      marginBottom: "auto",
                      border: "none",
                      background: "none",
                    }}
                  />
                  <div>
                    {editImageFile ? ( // Check if there's a new image file
                      <img
                        src={URL.createObjectURL(editImageFile)}
                        alt="New Image"
                        style={{ maxWidth: "100%", maxHeight: "200px" }}
                      /> // Display the new image
                    ) : (
                      <img
                        src={clickedBlogImage}
                        alt="Existing Image"
                        style={{ maxWidth: "100%", maxHeight: "200px" }}
                      /> // Display the existing image
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <h3>Upload Picture/Image for your Blog</h3>
                    &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                    <Upload
                      beforeUpload={() => false} // Prevent default upload behavior
                      onChange={(info) => handleEditImageChange(info.file)}
                    >
                      <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                  </div>
                  <h3> Description: </h3>
                  <TextArea
                    showCount
                    minHeight={500}
                    onChange={handleEditParagraphChange}
                    placeholder="Write your blog content here."
                    rows={15}
                    value={editParagraph}
                  />
                </Col>

                <Col>
                  <br />
                  <Button
                    icon={<DeleteRowOutlined />}
                    onClick={() => setEditModalVisible(false)}
                  >
                    Discard Changes
                  </Button>
                  &nbsp;
                  <Button
                    icon={<SaveOutlined />}
                    onClick={submitEditChange}
                    loading={editLoading}
                  >
                    Save/Publish Changes
                  </Button>
                </Col>
              </Layout>
            </Modal>
          </div>
        )}
      </Layout>

      <AppFooter />
    </>
  );
};

export default BlogList;
