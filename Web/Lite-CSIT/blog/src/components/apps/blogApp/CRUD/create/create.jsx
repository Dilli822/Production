
import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Input,
  Button,
  Col,
  message,
  Upload,
  Alert,
  Spin,
} from "antd";
import { SaveOutlined, UploadOutlined } from "@ant-design/icons";
import AppHeader from "../../header/header";
import AppFooter from "../../footer/footer";
import Forbidden from "../../error/unathorizedAccess";

const { Title } = Typography;
const { TextArea } = Input;

const validImageTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/webp",
  "image/tiff",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "image/vnd.wap.wbmp",
  "image/heif",
  "image/heic",
  "image/jxr",
  "image/avif",
];

const Create = () => {
  const [header, setHeader] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(true); // Assuming the user is logged in initially
  const [error, setError] = useState(null);

  const handleHeaderChange = (e) => {
    setHeader(e.target.value);
  };

  const handleParagraphChange = (e) => {
    setParagraph(e.target.value);
  };

  const handlePostBlog = () => {
    // Check if the title meets the minimum length requirement
    if (header.length < 5) {
      message.error("Title must be at least 10 characters long.");
      return;
    }

    // Check if the description meets the minimum length requirement
    if (paragraph.length < 20) {
      message.error("Description must be at least 50 characters long.");
      return;
    }

    setLoading(true);

    // Create a FormData object to handle the blog post data and image
    const formData = new FormData();
    formData.append("title", header);
    formData.append("description", paragraph);
    formData.append("user", localStorage.getItem("user_id"));
    formData.append("username", localStorage.getItem("user_name"));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    fetch("https://web-production-4cd0.up.railway.app/blog/api/blog-details/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        handleSubmissionSuccess();
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error posting blog:", error);
        message.error("Failed to post blog. Please try again.");
      });
  };

  const uploadImage = (blogId) => {
    const formData = new FormData();
    formData.append("file", imageFile);

    fetch(`https://web-production-4cd0.up.railway.app/blog/api/blog-details/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        handleSubmissionSuccess();
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error uploading image:", error);
        message.error("Failed to upload image. Please try again.");
      });
  };

  const props = {
    name: "file",
    action: "https://web-production-4cd0.up.railway.app/blog/api/blog-details/",
    headers: {
      authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    beforeUpload: (file) => {
      const isImage = validImageTypes.includes(file.type);

      if (!isImage) {
        message.error("You can only upload JPG/PNG/GIF/BMP/WebP files!");
      }

      setImageFile(file);
      return false;
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const handleSubmissionSuccess = () => {
    setLoading(false);
    setSubmissionSuccess(true);
    setHeader("");
    setParagraph("");
    setImageFile(null);
    message.success("Blog and image posted successfully!");
    setTimeout(() => {
      window.location.pathname = "/profile";
    }, 2000);
  };

  useEffect(() => {
    // Assuming you're checking user authentication here
    if (
      !localStorage.getItem("user_name") ||
      !localStorage.getItem("user_id")
    ) {
      setIsLogged(false);
    }

    // Set loading to false after initial render
    setIsLoading(false);
  }, []); // empty dependency array means it runs only once after the initial render

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
            <Col>
              <Title> Publish/Write Blog</Title>
              <h2>Title: </h2>
              <Input
                placeholder="Enter Blog Title"
                value={header}
                onChange={handleHeaderChange}
                style={{
                  marginBottom: "16px",
                  border: "none",
                  minHeight: "55px",
                  background: "none",
                  height: "auto",
                }}
              />

              <div>
                {/* Render the uploaded image */}
                {imageFile && (
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Uploaded Image"
                    style={{ height: "250px" }}
                  />
                )}
              </div>
              <div style={{ display: "block", alignItems: "center" }}>
                <h3>Upload Picture/Image for your Blog</h3>
                &nbsp;&nbsp;
                <Upload {...props}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </div>

              <h3> Description: </h3>
              <TextArea
                showCount
                autoSize={{ minRows: 16, maxRows: 1000 }}
                minHeight={500}
                onChange={handleParagraphChange}
                placeholder="Write your blog content here."
                value={paragraph}
                style={{
                  border: "1px solid #dbd9ee",
                  background: "none",
                  height: "auto",
                }}
              />
            </Col>

            <Col>
              <br />
              <Button icon={<SaveOutlined />} onClick={handlePostBlog}>
                Discard Changes
              </Button>
              &nbsp;
              <Button
                icon={<SaveOutlined />}
                onClick={handlePostBlog}
                loading={loading}
              >
                Post/Publish Blog
              </Button>
            </Col>
            <br></br>
          </Layout>
          <br></br>
        </div>
      )}

      <AppFooter />
    </>
  );
};

export default Create;
