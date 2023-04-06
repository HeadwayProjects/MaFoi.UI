import React, { useState } from "react";
import { navigate } from "raviger";
import Carousel from "react-bootstrap/Carousel";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import logo from '../../assets/img/logo.png';
import bannerimg1 from '../../assets/img/banner1.jpg';
import bannerimg2 from '../../assets/img/banner2.jpg';
import bannerimg3 from '../../assets/img/banner3.jpg';
import * as api from '../../backend/request';
import * as auth from '../../backend/auth';
import "./login.css";
import { preventDefault } from "../../utils/common";
import { toast } from 'react-toastify';

function Login() {
  const [submitting, setSubmitting] = useState(false);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  function login(event) {
    preventDefault(event);
    setSubmitting(true);
    api.post(`/api/Auth/Login?username=${username}&password=${password}`).then(response => {
      console.log(response)
      if (response && response.data) {
        auth.setAuthToken(response.data);
        navigate('/dashboard', { replace: true });
        window.location.reload();
      } else {
        toast.error('Email/Phone No. or password is incorrect.');
      }
    }).finally(() => setSubmitting(false));
  }

  return (
    <div className="row m-0 overflow-hidden">
      <div className="col-md-8 p-0 bannerSlider">
        <Carousel>
          <Carousel.Item>
            <img className="d-block" src={bannerimg1} alt="First slide" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block" src={bannerimg2} alt="Second slide" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block" src={bannerimg3} alt="Third slide" />
          </Carousel.Item>
        </Carousel>
      </div>

      <div className="col-md-4 loginSection px-5 py-3">
        <div className="d-flex flex-column h-100">
          <div className="navbar-brand p-0 text-center"><img src={logo} alt="Logo" width="344" /></div>
          <Form noValidate>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Email/Phone No *</Form.Label>
              <Form.Control type="email" required placeholder="Enter email" onInput={(e) => setUsername(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" required placeholder="Password" onInput={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <div className="mb-3">
              <a href="/" onClick={preventDefault} className="text-greyDark">Forgot Password</a>
            </div>
            <div className="text-center">
              <div>
                <Button variant="primary" type="submit" className="btn btn-primary btn-app-primary"
                  disabled={!username || !password || submitting}
                  onClick={login}>
                  Login
                </Button>
              </div>
              <div><span className="text-greyDark">Create an account <a href="/" onClick={preventDefault}>Signup</a></span></div>
              <div><span className="text-greyDark">-or-</span></div>
              <div><a href="/" onClick={preventDefault} className="text-appprimary">Login with OTP</a></div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
