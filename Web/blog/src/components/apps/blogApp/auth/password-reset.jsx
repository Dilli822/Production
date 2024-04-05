import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Row, Col, Layout } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import AppHeader from "../header/publicHeader";
import AppFooter from "../footer/footer";

const PasswordResetPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { token } = useParams(); // Extract token from URL path
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    const { email, newPassword } = values;

    try {
      const response = await fetch(
        ` https://web-production-4cd0.up.railway.app/account/update-password/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, email, new_password: newPassword }), // Include token in the request body
        }
      );

      if (response.ok) {
        message.success("Password reset successful");
        form.resetFields();
        setTimeout(() => {
          navigate("/login"); // Redirect to the login page after 20 milliseconds
        }, 1000);
      } else {
        message.error(
          "Failed to reset password. Token Expired. Please send your reset-email again."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred while resetting the password.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <AppHeader />
      <Layout>
        <Row justify="center" align="middle" style={{ minHeight: "80vh" }}>
          <Col xs={22} sm={12} md={9} lg={8} xl={7}>
            <div
              style={{
                padding: "20px",
                backgroundColor: "#fff",
                borderRadius: "10px",
                boxShadow: "3px 6px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                Password Reset
              </h2>
              <Form
                form={form}
                name="password_reset"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                    {
                      type: "email",
                      message: "Please enter a valid email address!",
                    },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>

                <Form.Item
                  name="newPassword"
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
                              one lowercase letter, uppercase letter, digit &
                              <br />
                              special character
                            </div>
                          ),
                        });
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="New Password"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmNewPassword"
                  dependencies={["newPassword"]}
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your Password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          "The two passwords do not match!"
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Confirm New Password"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                  >
                    Reset Password
                  </Button>
                </Form.Item>
                <a className="login-form-forgot" href="/forgot-password">
                  Resend Password Reset-Mail?
                </a>
              </Form>
            </div>
          </Col>
        </Row>
      </Layout>

      <AppFooter />
    </>
  );
};

export default PasswordResetPage;
