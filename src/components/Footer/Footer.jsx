import React from "react";
import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import logo from "../../assets/images/res-logo.png";

import "../../styles/footer.css";

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg="3" md="4" sm="6">
            <div className=" footer__logo text-start">
              <img src={logo} alt="logo" style={{ borderRadius: "50%" }} />
              <h5>Culinary Oasis</h5>
              <p>
                Indulge Your Senses, Elevate Your Tastes - Exclusively Yours at
                Culinary Oasis
              </p>
            </div>
          </Col>

          <Col lg="2" md="4" sm="6">
            <ListGroup className="deliver__time-list">
              <ListGroupItem className=" delivery__time-item border-0 ps-0"></ListGroupItem>

              <ListGroupItem className=" delivery__time-item border-0 ps-0"></ListGroupItem>
            </ListGroup>
          </Col>

          <Col lg="4" md="4" sm="6">
            <h5 className="footer__title">Contact</h5>
            <ListGroup className="deliver__time-list">
              <ListGroupItem className=" delivery__time-item border-0 ps-0">
                <p>Location: 100 Huynh Lam,Hoa Hai, Da Nang </p>
              </ListGroupItem>
              <ListGroupItem className=" delivery__time-item border-0 ps-0">
                <span>Phone: 0764607869</span>
              </ListGroupItem>

              <ListGroupItem className=" delivery__time-item border-0 ps-0">
                <span>Email: culinaryoasis@gmail.com</span>
              </ListGroupItem>
            </ListGroup>
          </Col>

          <Col lg="3" md="4" sm="6">
            <h5 className="footer__title">Newsletter</h5>
            <p>Subscribe our newsletter</p>
            <div className="newsletter">
              <input type="email" placeholder="Enter your email" />
              <span>
                <i className="ri-send-plane-line"></i>
              </span>
            </div>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col lg="6" md="6"></Col>
          <Col lg="6" md="6">
            <div className="social__links d-flex align-items-center gap-4 justify-content-end">
              <p className="m-0">Follow: </p>
              <span>
                <Link to="https://www.facebook.com/muhib160">
                  <i className="ri-facebook-line"></i>
                </Link>
              </span>

              <span>
                <Link to="https://github.com/muhib160">
                  <i className="ri-github-line"></i>
                </Link>
              </span>

              <span>
                <Link to=" https://www.youtube.com/c/MuhibsTechDiary">
                  <i className="ri-youtube-line"></i>
                </Link>
              </span>

              <span>
                <Link to=" https://www.linkedin.com/in/muhib160/">
                  <i className="ri-linkedin-line"></i>
                </Link>
              </span>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
