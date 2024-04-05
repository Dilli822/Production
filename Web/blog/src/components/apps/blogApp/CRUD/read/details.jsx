import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spin, Row, Button, Col, Typography, Image, Layout, Alert } from "antd";
import AppHeader from "../../header/header";
import AppFooter from "../../footer/footer";

const { Title, Text } = Typography;
const { Content } = Layout;

const Details = () => {
  const { id } = useParams();
  const [isLoading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await fetch(
          `https://web-production-4cd0.up.railway.app/blog/api/blog-details/${id}/`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch blog details. HTTP Status: ${response.status}`
          );
        }

        const resultItems = await response.json();
        const { user_id, ...mappedDetails } = resultItems;
        setDetails(mappedDetails);
      } catch (error) {
        console.error("Error fetching blog details:", error);
        setError("Failed to fetch blog details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);

  return (
    <>
      <div>
        {" "}
        <AppHeader />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        {isLoading ? (
          <Spin size="large" />
        ) : error ? (
          <div>
            <Alert message={error} type="error" />
            <Button
              style={{ marginTop: "10px" }}
              onClick={() => window.location.reload()}
            >
              {" "}
              Reload Again{" "}
            </Button>
          </div>
        ) : (
          <>
            <Content className="ant-container">
              <Row>
                <Col span={24}>
                  <Title>{details.title}</Title>
                  <Text>
                    {new Date(details.created_at).toLocaleString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                    &nbsp; | {details.username}{" "}
                  </Text>
                  <Text>
                    <p> {/* {details.user} | */}</p>
                  </Text>
                  <br />

                  <div style={{ textAlign: "center" }}>
                    <Image
                      src={details.image}
                      alt="Blog Image"
                      style={{ maxWidth: "100%", width: "500px" }}
                    />
                  </div>

                  <br />

                  <Text size="large" style={{ fontSize: "18px" }}>
                    {details.description
                      .split("\r\n")
                      .map((paragraph, index) => (
                        <React.Fragment key={index}>
                          {paragraph}
                          <br />
                        </React.Fragment>
                      ))}
                  </Text>
                </Col>
              </Row>
            </Content>
          </>
        )}
      </div>
      <br></br>
      <br></br>
      <AppFooter />
    </>
  );
};

export default Details;
