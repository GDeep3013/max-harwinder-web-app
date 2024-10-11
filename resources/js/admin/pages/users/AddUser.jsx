import React, { useState, useEffect } from "react";
import AuthLayout from "../../../layout/Auth";
import { Col, Row, Container, Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { RightArrowIcon, Edit, Remove, Logout } from '../../../components/svg-icons/icons';
import Swal from 'sweetalert2'
import axios from "axios"

// import { fetchOrgnizations } from "../../../apis/OrgnizationApi";

export default function AddEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    last_name: '',
    email: '',
    status: 'Active',
    _method: '',
    created_by: null
  });
  // const [errors, setErrors] = useState({});
  const [errors, setErrors] = useState({
    full_name: '',
    last_name: '',
    email: '',
  });

  const [isChecked, setIsChecked] = useState(true);

  const handleSwitchChange = (e) => {
    setIsChecked(e.target.checked); // Access the checked state
    let uStatus = "";
    if (e.target.checked) {
      uStatus = "Active";
    } else {
      uStatus = "InActive";
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      status: uStatus,
    }));
  };

  const isValidEmail = (email) => {
    // Simple email validation regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  useEffect(() => {
    if (id) {
      fetch(`/staff/${id}`)
        .then((response) => response.json())
        .then((data) => {
          let status = data.data.status === "Active" ? true : false;
          setIsChecked(status);
          setFormData({
            full_name: data.data.name.split(' ')[0],
            last_name: data.data.name.split(' ')[1],
            email: data.data.email,
            status: data.data.status, 
            _method: 'PUT',
          });
        });
    }
  }, [id]);


  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    const namePattern = /^[A-Za-z\s]+$/;
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Name is required';
    } else if (formData.full_name.trim().length < 3) {
      newErrors.full_name = 'Name must be at least 3 characters long';
    } else if (!namePattern.test(formData.full_name.trim())) {
      newErrors.full_name = 'Name can only contain letters';
    }
    if (!namePattern.test(formData.last_name.trim())) {
      newErrors.last_name = 'Last name can only contain letters';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(validateForm(), "checkValidation");
    if (validateForm()) {
      setLoader(true)

      let url = "/staff";
      if (id) {
        url = `/staff/${id}`;
      }
      const requestOptions = {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      };
      fetch(url, requestOptions)
        .then((res) => res.json())
        .then((data) => {
          setLoader(false);
          if (data.status !== "error" && data.status == true) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: data.message,
              showConfirmButton: false,
              timer: 1500
            });
            setTimeout(function () { navigate('/pages/users') }, 2000);
          } else if (data.status === "error") {
            setErrors((prevErrors) => ({
              ...prevErrors,
              ...data.message,
            }));
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: data.message,
              showConfirmButton: false,
              timer: 1500
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    // await axios.post(url, formData, {
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })
    //   .then(response => {
    //     console.log(response, "Create Staff Response")
    //     setLoader(false)
    //     if (response.data.status) {
    //       Swal.fire({
    //         position: "center",
    //         icon: "success",
    //         title: response.data.message,
    //         showConfirmButton: false,
    //         timer: 1500
    //       });
    //       setTimeout(() => navigate('/pages/users'), 1500);
    //     } else {
    //       Swal.fire({
    //         position: "center",
    //         icon: "error",
    //         title: response.data.message,
    //         showConfirmButton: false,
    //         timer: 1500
    //       });
    //     }

    //   })
    //   .catch(error => {
    //     if (error.response) {
    //       console.log('error.response', error.response);
    //       setErrors(error.response.data.errors?.[0]);
    //       setErrors(error.response.data.errors);
    //       setLoader(false)

    //     } else if (error.request) {
    //       console.log('No response received from the server');
    //     } else {
    //       console.error('Error:', error.message);
    //       // setErrors(error.message);
    //     }
    //   });
  };




  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log(name, value);
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  // console.log(formData);

  // useEffect(() => {
  //   if (id) {
  //     const fetchUserDetails = async (id) => {
  //       try {
  //         const response = await fetch(`/staff/${id}`);
  //         if (!response.ok) {
  //           throw new Error('Failed to fetch user details');
  //         }
  //         const userData = await response.json();
  //         setFormData({
  //           full_name: userData.name.split(' ')[0],
  //           last_name: userData.name.split(' ')[1],
  //           email: userData.email ? userData.email : '',
  //           status: userData.status ? userData.status : '',
  //           _method: 'PUT',
  //         });
  //       } catch (error) {
  //         console.error('Error fetching user details:', error);
  //       }
  //     };
  //     fetchUserDetails(id);
  //   }

  // }, [id]);



  return (
    <>
      <AuthLayout title={id ? 'Edit User' : "Add User"}>
        <div className="tabe-outer">
          <div className="main-back-heading">
            <div className="container">
              <div className="row">
                <div className="col-md-6 p-0">
                  <div className="profile-btns pt-0">
                    <Button className="default-btn cancel-btn ml-0 product-back-btn" onClick={() => navigate(-1)}>
                      <RightArrowIcon />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-outer main-wrapper p-c-3 bg-white ml-8 shadow-border-wrapper">
          <div className="content-outer main-wrapper pd-2 bg-white">
            <Form className="profile-form">
              <div className="employee-outer d-flex">

                <div className="employee-content">

                  <Container>
                    <Row>
                      <Col md={6}>
                        <Form.Group
                          className="mb-4">
                          <Form.Label>First Name</Form.Label><sup style={{ color: 'red' }}>*</sup>
                          <Form.Control
                            type="text"
                            name="full_name"
                            placeholder=""
                            value={formData.full_name}
                            onChange={(e) => { handleChange(e) }}
                          />
                          {errors?.full_name && <small className="text-danger">{errors?.full_name}</small>}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group
                          className="mb-4">
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="last_name"
                            placeholder=""
                            value={formData.last_name}
                            onChange={(e) => { handleChange(e) }}
                          />
                          {errors?.last_name && <small className="text-danger">{errors?.last_name}</small>}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group
                          className="mb-4">
                          <Form.Label>Email Address</Form.Label><sup style={{ color: 'red' }}>*</sup>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => { handleChange(e) }}
                            placeholder=""
                          />
                          {errors?.email && <small className="text-danger">{errors?.email}</small>}
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group
                          className="mb-4">
                          <Form.Label>Acive/InActive</Form.Label><sup style={{ color: 'red' }}>*</sup>
                          <Form.Check // prettier-ignore
                            type="switch"
                            name="status"
                            id="custom-switch"
                            checked={isChecked}
                            onChange={handleSwitchChange}
                          />
                          {errors?.status && <small className="text-danger">{errors?.status}</small>}
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <div className="profile-btns pt-0">
                          <Button className="default-btn" onClick={handleSubmit}>{id ? "Update" : "Save"}</Button>
                          <Button className="default-btn cancel-btn" onClick={() => navigate(-1)}>Cancel</Button>
                        </div>
                      </Col>
                    </Row>
                  </Container>

                </div>
              </div>
            </Form>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
