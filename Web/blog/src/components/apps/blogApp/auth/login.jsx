import React, { useState, useEffect } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Layout, Checkbox, message } from "antd";
import { useNavigate } from "react-router-dom";
import AppHeader from "../header/publicHeader";
import AppFooter from "../footer/footer";

const Login = () => {
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await fetch(" https://web-production-4cd0.up.railway.app/account/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        if (response.status === 401) {
          const data = await response.json();
          setErrorMessage(data.detail);
          message.error(data.detail);
        } else if (response.status === 503 || response.status === 500) {
          message.error(data.detail);
        } else {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        return;
      }

      const data = await response.json();
      const { access, refresh } = data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      message.success("Login successful!");
      navigate("/feed");
    } catch (error) {
      console.error("Login failed:", error);
      message.error(
        error.detail || "An unexpected error occurred. Please try again later."
      );
    }
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
          form={form}
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <h1>Login</h1>
          {errorMessage && (
            <div style={{ marginBottom: 16, color: "red" }}>{errorMessage}</div>
          )}
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
              type="email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a className="login-form-forgot" href="/forgot-password">
              Forgot password
            </a>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              style={{ width: "100%" }}
            >
              Log in
            </Button>
            <br />
            Or <a href="/signup">register now!</a>
          </Form.Item>
        </Form>
        <AppFooter />
      </Layout>
    </>
  );
};

export default Login;
