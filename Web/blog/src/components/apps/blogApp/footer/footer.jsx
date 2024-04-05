
import React, { useState } from "react";
import { Layout, Space } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  GithubOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;

const AppFooter = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Footer style={{ textAlign: "center", padding: "0 10%" }}>
        <br />
        <hr />
        Blog App © 2024-{new Date().getFullYear()} Created by Dilli Hang Rai
        <br />
        {/* Social Media Icons with Links */}
        <Space size={12} style={{ margin: "16px 0" }}>
          <a href="https://youtube.com/@dilli_hangrae" target="blank">
            <YoutubeOutlined />
          </a>
          <a href="https://instagram.com/dilli_hangrae" target="blank">
            <InstagramOutlined />
          </a>
          <a href="https://github.com/dilli822" target="blank">
            <GithubOutlined />
          </a>
          <a href="https://www.linkedin.com/in/dilli708" target="blank">
            <LinkedinOutlined />
          </a>
          <a href="https://twitter.com/dilli_hangrae" target="blank">
            <TwitterOutlined />
          </a>
        </Space>
      </Footer>
    </>
  );
};

export default AppFooter;
