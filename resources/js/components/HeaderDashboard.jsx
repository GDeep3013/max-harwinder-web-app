import React from 'react'
import { Row, Col, Form, Dropdown, Container, InputGroup, DropdownButton} from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";


export default function HeaderDashboard({title, subTitle}) {

  // const user = useSelector((state) => state.auth.user);


  return (
    <div className='top-header'>
    <Container>
    <Row className='align-items-center dashboard-header'>
      <Col md={6} className='col-7'>
      <h1>{title}</h1>
        <p>Home / {subTitle ? subTitle : title}</p>
      </Col>
      <Col md={6} className='col-5'></Col>
    </Row>
  </Container>

  </div>
  )
}
