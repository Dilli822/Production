import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AppHeader from "../header/header";
import AppFooter from "../footer/footer";
import Forbidden from "../error/unathorizedAccess";
import {
  Card,
  Col,
  Row,
  Layout,
  Button,
  theme,
  List,
  AutoComplete,
  Input,
  Spin,
  Alert,
} from "antd";

import {
  ArrowRightOutlined,
  ArrowLeftOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Meta } = Card;
const { Header, Sider, Content } = Layout;
const { Option } = AutoComplete;

const formatDate = (rawDate) => {
  const options = { day: "numeric", month: "short", year: "numeric" };
  const formattedDate = new Date(rawDate).toLocaleDateString(
    undefined,
    options
  );
  return formattedDate;
};

const NewsFeed = ({
  fetchTotalBlogsData,
  totalBlogsPosted,
  isLoading,
  error,
}) => {
  const [visibleCards, setVisibleCards] = useState(4);
  const [isAdditionalVisible, setIsAdditionalVisible] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const currentDate = new Date().toLocaleDateString();
  const options = { day: "numeric", month: "short", year: "numeric" };
  const formattedDate = new Date(currentDate).toLocaleDateString(
    undefined,
    options
  );

  const cardData = Array.from({ length: 24 }, (_, index) => ({
    key: index + 1,
    user: `${index + 1}`,
    title: `${index + 1}`,
    description: `}`,
    date: `${formattedDate}`,
    imageUrl: `https://unsplash.it/500?random=${index + 1}`,
  }));

  const handleToggleVisibility = () => {
    if (isAdditionalVisible) {
      setVisibleCards(4);
    } else {
      setVisibleCards(cardData.length);
    }
    setIsAdditionalVisible(!isAdditionalVisible);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const timelineItems = [
    {
      children: "Create account",
    },
    {
      children: "Prepare your blog or articles",
    },
    {
      children: "Post Your Article or blog",
    },
    {
      children: "Done!",
    },
  ];

  const [blogData, setBlogData] = useState([]);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/blog/api/blog-details/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        switch (response.status) {
          case 401:
            setIsLogged(false);
            setLoading(false);
            break;
          case 404:
            setLoading(false);
            setIsLogged(true);
            setNotFound(true);
            break;
          case 200:
            const data = await response.json();
            console.log(data);
            data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setBlogData(data);
            setNotFound("");
            setIsLogged(true);
            setLoading(false);
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchBlogData();
    // Cleanup function if needed
    return () => {
      // Cleanup logic
    };
  }, []);
  const visibleRecentsCards = 4;

  const recentBlogs = blogData
    .filter((blogItem) => {
      // Calculate the time difference in hours
      const timeDifference =
        (new Date() - new Date(blogItem.created_at)) / (1000 * 60 * 60);
      return timeDifference <= 24;
    })
    .slice(0, visibleRecentsCards);

  // Filter blogs created between yesterday and today
  const filteredRecentBlogs = recentBlogs.filter((blogItem) => {
    const blogDate = new Date(blogItem.created_at);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    return blogDate >= yesterday && blogDate <= today;
  });

  const searchedBlogResult = blogData.filter((blogItem) =>
    blogItem.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Spin
        size="large"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    );
  }

  if (!isLogged) {
    return <Forbidden />;
  }

  return (
    <>
      <AppHeader></AppHeader>

      <Layout className="ant-container ">
        <>
          <br />
          <h2 style={{ textAlign: "left" }}> Blog & Articles </h2>
          {blogData.length === 0 && (
            <div style={{ textAlign: "left", marginTop: "20px", color: "red" }}>
              <h1>No blogs to show</h1>
              <div>
                <Alert message={error || ".No Data Found"} type="error" />
                <Button
                  style={{ marginTop: "10px" }}
                  onClick={() => window.location.reload()}
                >
                  {" "}
                  Reload Again{" "}
                </Button>
              </div>
              <div></div>
            </div>
          )}

          <Row gutter={24} style={{}}>
            <Col md={17} style={{}}>
              {blogData.slice(0, visibleCards).map((blogItem) => (
                <Col
                  xs={24}
                  md={24}
                  key={blogItem.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "1%",
                    padding: "2% 0",
                    background: "#fff",
                    borderRadius: "8px",
                  }}
                >
                  <Col xs={4} md={3}>
                    <Link
                      to={`/details/${blogItem.id}`}
                      style={{
                        fontWeight: "normal",
                        alignItems: "start",
                        color: "#000",
                      }}
                    >
                      <img
                        alt="no-image"
                        src={blogItem.image}
                        style={{ width: "100%", borderRadius: "3px" }}
                      />
                    </Link>
                  </Col>

                  <Col xs={19} md={19}>
                    <Link
                      to={`/details/${blogItem.id}`}
                      style={{
                        fontWeight: "normal",
                        alignItems: "start",
                        color: "#000",
                      }}
                    >
                      <h2>{blogItem.title}</h2>

                      <p>
                        {blogItem.description
                          .split(" ")
                          .slice(0, 20)
                          .join(" ") +
                          (blogItem.description.split(" ").length > 50
                            ? " ..."
                            : "")}
                      </p>
                    </Link>
                    <p>
                      <span>
                        {" "}
                        {/* <b>#{blogItem.user}, </b>{" "} */}
                        <b>{blogItem.username} ,</b> &nbsp;
                        <span>
                          🗓️{" "}
                          {new Date(blogItem.created_at).toLocaleString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )}
                        </span>
                      </span>
                    </p>
                  </Col>
                </Col>
              ))}

              {blogData.length > visibleCards && (
                <div style={{ textAlign: "left", marginTop: "20px" }}>
                  <Button
                    icon={
                      isAdditionalVisible ? (
                        <ArrowLeftOutlined />
                      ) : (
                        <ArrowRightOutlined />
                      )
                    }
                    onClick={handleToggleVisibility}
                  >
                    {isAdditionalVisible ? "Hide" : "View More"}
                  </Button>
                </div>
              )}
              <br />

              {notFound ? <h1>Not Found Error</h1> : ""}
            </Col>

            <Col
              md={7}
              xs={24}
              style={{
                background: "#fff",
                borderRadius: "8px",
                position: "sticky",
                top: "50px",
                margin: "10px 0",
                height: "calc(100vh - 200px)",
                overflow: "auto",
              }}
            >
              <h3>
                Recent | Total Blogs Posted:{" "}
                {localStorage.getItem("total_blogs_count")}+
              </h3>
              <div>
                <Input
                  type="text"
                  placeholder="Search Blogs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  prefix={<SearchOutlined />}
                  size="large" // Set the size to "large" for a larger input
                />
              </div>

              {searchQuery && (
                <>
                  <h3>Result:</h3>
                  <List
                    dataSource={searchedBlogResult}
                    renderItem={(blogItem) => (
                      <List.Item>
                        <Link to={`/details/${blogItem.id}`}>
                          <Card
                            hoverable
                            cover={
                              <img
                                alt={blogItem.title}
                                src={blogItem.image}
                                style={{ width: "100%", borderRadius: "3px" }}
                              />
                            }
                          >
                            <div style={{ height: "auto", overflow: "hidden" }}>
                              <h4>{blogItem.title} </h4>
                              <p>
                        {blogItem.description
                          .split(" ")
                          .slice(0, 10)
                          .join(" ") +
                          (blogItem.description.split(" ").length > 10
                            ? " ..."
                            : "")}
                      </p>{" "}
                            </div>
                          </Card>
                        </Link>
                      </List.Item>
                    )}
                  />
                </>
              )}

              <br />
              <hr />

              {filteredRecentBlogs.map((blogItem, index) => (
                <Col key={index} xs={24} md={24}>
                  <Col xs={24}>
                    <Link
                      to={`/details/${blogItem.id}`}
                      style={{
                        fontWeight: "normal",
                        alignItems: "start",
                        color: "#000",
                      }}
                    >
                      <img src={blogItem.image} style={{ width: "100px" }} />
                      <h3>{blogItem.title}</h3>
                      <p>
                        🗓️{" "}
                        {new Date(blogItem.created_at).toLocaleString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}{" "}
                      </p>
                      <p>
                        {blogItem.description
                          .split(" ")
                          .slice(0, 5)
                          .join(" ") +
                          (blogItem.description.split(" ").length > 5
                            ? " ..."
                            : "")}
                      </p>{" "}
                      <hr />
                      <br></br>
                    </Link>
                    {/* <p>🗓️ {blogItem.created_at.toLocaleString()} </p> */}
                  </Col>
                </Col>
              ))}
            </Col>
          </Row>
        </>
      </Layout>
      <br />
      <AppFooter />
    </>
  );
};
export default NewsFeed;
