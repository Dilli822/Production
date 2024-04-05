import React, { useState, useEffect } from "react";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Layout, Form, Input, Button, Checkbox, message } from "antd";
import { useNavigate } from "react-router-dom";

import AppHeader from "../header/publicHeader";
import AppFooter from "../footer/footer";

const Signup = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      // Use the register API endpoint
      const response = await fetch(
        " https://web-production-4cd0.up.railway.app/account/api/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // If registration is successful, show success message, then navigate to login
        message.success("Signup successful!", 25);
        navigate("/login");
      } else {
        if (response.status === 400) {
          // Handle validation errors
          const errorMessages = Object.values(data).flat().join(", ");
          message.error(errorMessages);
        } else {
          // Handle other errors
          message.error(
            data.detail || "Error during signup. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("Error during signup:", error);
      message.error("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formItemLayout = {
    labelCol: {
      span: 24,
    },
    wrapperCol: {
      span: 24,
    },
  };

  const buttonItemLayout = {
    wrapperCol: {
      span: 24,
    },
  };

  useEffect(() => {
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
  }, []);

  return (
    <>
      <AppHeader />
      <Layout
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "90vh",
        }}
      >
        <Form
          {...formItemLayout}
          form={form}
          name="signup_form"
          className="signup-form"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
        >
          <h1>Create a user account</h1>
          <Form.Item
            name="first_name"
            rules={[
              { required: true, message: "Please input your firstname!" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="firstname"
            />
          </Form.Item>

          <Form.Item
            name="last_name"
            rules={[{ required: true, message: "Please input your lastname!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="lastname"
            />
          </Form.Item>

          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Please input your username!" },
              { min: 5, message: "Username must be at least 5 characters." },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email address!",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your Password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    !value ||
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
                      value
                    )
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject({
                    message: "Password must meet the following criteria:",
                    // Use HTML <br> tags for line breaks
                    message: (
                      <div>
                        Password must be at least 8 characters long <br />
                        one lowercase letter, uppercase letter, digit &<br />
                        special character
                      </div>
                    ),
                  });
                },
              }),
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your Password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("The two passwords do not match!");
                },
              }),
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Confirm Password"
            />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>I agree to the terms and conditions</Checkbox>
            </Form.Item>
          </Form.Item>

          <Form.Item {...buttonItemLayout}>
            <Button
              type="primary"
              htmlType="submit"
              className="signup-form-button"
              style={{ width: "100%" }}
              loading={loading}
            >
              Sign Up
            </Button>

            <a href="/login">Already Have an Account? Login now!</a>
          </Form.Item>
        </Form>
        <AppFooter />
      </Layout>
    </>
  );
};

export default Signup;
