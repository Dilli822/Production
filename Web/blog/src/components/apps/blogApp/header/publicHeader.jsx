import React, { useState, useEffect } from "react";
import { Layout, Menu, Modal } from "antd";
import { Link } from "react-router-dom";
// import logoImage from "../img/logo/blogCofffee.jpg";
import logoImage from "../img/about/logo.jpeg";
const { Header } = Layout;

const PublicAppHeader = () => {
  const [menuLoggedItems] = useState([
    { key: "home", label: "Home", path: "/" },
    { key: "login", label: "Login", path: "/login" },
    { key: "Signup", label: "Signup", path: "/signup" },
    { key: "AboutUs", label: "About Us", path: "/about" },
  ]);

  const onMenuItemClick = (path) => {};

  return (
    <>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 999,
          width: "100%",
          padding: "5px 0",
        }}
      >
        <div className="ant-container" style={{ display: "flex" }}>
          <div style={{ width: "50%" }}>
            <Link to={"/"}>
              <img
                src={logoImage}
                alt="Logo"
                style={{
                  width: "50px",
                  verticalAlign: "middle",
                  borderRadius: "10px",
                }}
              />
            </Link>
          </div>
          <div style={{ width: "50%" }}>
            <Menu
              theme="dark"
              mode="horizontal"
              style={{ display: "flex", justifyContent: "end" }}
              onClick={({ key }) =>
                onMenuItemClick(
                  menuLoggedItems.find((item) => item.key === key)?.path
                )
              }
            >
              {menuLoggedItems.map(({ key, label, path }) => (
                <Menu.Item key={key}>
                  <Link to={path}>{label}</Link>
                </Menu.Item>
              ))}
            </Menu>
          </div>
        </div>
      </Header>
    </>
  );
};

export default PublicAppHeader;
