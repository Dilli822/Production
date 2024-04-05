import React from "react";
import { Layout, Typography, Row, Col } from "antd";
import AppHeader from "../header/publicHeader";
import AppFooter from "../footer/footer";
import aboutImg from "../img/about/about.svg"

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const AboutUs = () => {
  return (
    <div>
    <AppHeader />
    <Layout className="ant-container">
     
      <Content style={{ background: "#fff", padding: "24px", minHeight: 280 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Title>About:</Title>
            <Paragraph style={{ fontSize: "18px"}}>
              Welcome to the Blog Web developed by Dilli Hang Rai, a B.Sc.CSIT
              Student, Freelancer, and Software Developer.
            </Paragraph>
            <Paragraph style={{ fontSize: "18px"}}>
              This blog app is a full-stack web application developed by Dilli
              Hang Rai. It allows users to create, read, update, and delete
              blog posts. The frontend of the application is built using React,
              and the backend is developed using Django REST Framework.
            </Paragraph>
            <Paragraph style={{ fontSize: "18px"}}>
              The purpose of this blog app is to provide a platform for users
              to share their thoughts, experiences, and knowledge through blog
              posts. It aims to be user-friendly, responsive, and efficient.
            </Paragraph>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <img src={aboutImg} alt="About Us" style={{ maxWidth: "100%" }} />
          </Col>
        </Row>
      </Content>

    </Layout>
    <br></br>
 <AppFooter />
 </div>
  );
};

export default AboutUs;
