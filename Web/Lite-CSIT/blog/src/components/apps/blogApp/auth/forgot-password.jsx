import React, { useState, useEffect } from "react";
import {
  Layout,
  Form,
  Input,
  Button,
  Typography,
  Col,
  Row,
  message,
  Alert,
} from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import AppHeader from "../header/publicHeader";
import AppFooter from "../footer/footer";

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const onFinish = async (values) => {
    const { email } = values;
    setSubmitting(true);

    try {
      const response = await fetch(
        " https://web-production-4cd0.up.railway.app/account/password-reset-email/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        message.success("Password reset email sent successfully");
        setEmailSent(true);
        form.resetFields(); // Clear the input fields
      } else {
        message.error("Failed to send password reset email");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred while sending password reset email");
    } finally {
      setSubmitting(false);
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
          minHeight: "80vh",
        }}
      >
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <div
              style={{
                padding: "20px",
                backgroundColor: "#fff",
                borderRadius: "10px",
                boxShadow: "3px 6px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              {!emailSent ? (
                <Form
                  form={form}
                  name="forgot_password_form"
                  className="forgot-password-form"
                  onFinish={onFinish}
                  style={{ maxWidth: 500 }}
                >
                  <Typography.Title
                    level={6}
                    style={{ textAlign: "center", marginBottom: "1rem" }}
                  >
                    Forgot Password
                  </Typography.Title>
                  <Typography.Paragraph
                    style={{ textAlign: "center", marginBottom: "1rem" }}
                  >
                    <LockOutlined
                      style={{
                        fontSize: "34px",
                        marginRight: "8px",
                        color: "red",
                      }}
                    />
                    Forgetting passwords is not a good practice.
                  </Typography.Paragraph>
                  <Typography.Paragraph
                    style={{ textAlign: "center", marginBottom: "1rem" }}
                  >
                    Please enter your email to reset your password.
                  </Typography.Paragraph>
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        required: true,
                        type: "email",
                        message: "Please input your email!",
                      },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined className="site-form-item-mail" />}
                      placeholder="Email"
                      disabled={submitting}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="forgot-password-form-button"
                      style={{ minWidth: "100%" }}
                      disabled={submitting}
                    >
                      {submitting ? "Submitting..." : "Reset Password"}
                    </Button>
                  </Form.Item>
                </Form>
              ) : (
                <Alert
                  message="Check Your Email"
                  description="We've sent you a password reset link. Please check your email inbox (and spam folder) for further instructions."
                  type="success"
                  showIcon
                />
              )}
            </div>
          </Col>
        </Row>
      </Layout>
      <AppFooter />
    </>
  );
};

export default ForgotPassword;
