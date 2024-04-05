import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spin, Row, Col, Typography, Image, Layout, Button, Alert } from "antd";
import AppHeader from "../../../header/publicHeader";
import AppFooter from "../../../footer/footer";

const { Title, Text } = Typography;
const { Content } = Layout;

const PublicBlogDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await fetch(
          `https://web-production-4cd0.up.railway.app/blog/api/blog-details/${id}/`
        );

        if (!response.ok) {
          console.error(
            "Error fetching blog details. HTTP Status:",
            response.status
          );
          setError("Failed to fetch blog details");
          return;
        }

        const resultItems = await response.json();

        console.log(resultItems);
        // Exclude user_id from details
        const { user_id, ...mappedDetails } = resultItems;

        setDetails(mappedDetails);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog details:", error);
        setError("Failed to fetch blog details");
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);

  const handleReload = () => {
    window.location.reload();
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <>
      <AppHeader />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        {error ? (
          <div>
            <Alert message={error} type="error" />
            <Button style={{ marginTop: "10px" }} onClick={handleReload}>
              {" "}
              Reload Again{" "}
            </Button>
          </div>
        ) : (
          <Content className="ant-container">
            <Row>
              <Col span={24}>
                <>
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
                    &nbsp;| {details.username}
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

                  {/* Render other details as needed */}
                  <Text size="large" style={{ fontSize: "19px" }}>
                    {details.description
                      .split("\r\n")
                      .map((paragraph, index) => (
                        <React.Fragment key={index}>
                          {paragraph}
                          <br />
                        </React.Fragment>
                      ))}
                  </Text>
                </>
              </Col>
            </Row>
          </Content>
        )}
      </div>
      <br></br>
      <br></br>
      <AppFooter />
    </>
  );
};

export default PublicBlogDetails;
