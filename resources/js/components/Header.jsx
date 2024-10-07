import React from 'react'
import { Row, Col, Form, Dropdown, Container, InputGroup, DropdownButton } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { SearchIcon } from "../components/svg-icons/icons";
import ProfileImage from '../assets/images/user.png';
import { useSelector, useDispatch } from "react-redux";



export default function SideBar() {
  // const user = useSelector((state) => state.auth.user);
  return (
    <div className='top-header'>
      <Container>
        <Row>
          <Col md={12} xl={12} className='text-end'>
            <div className="headerSearch">
              <Dropdown>
                <Dropdown.Toggle id="dropdown-basic">
                  <div className="Profile d-flex">
                    <div className="profileImg">
                      <img src={ProfileImage} alt="User Image" />
                    </div>
                    <div className="profileName">
                      <h3>Webzia</h3>
                      <p>Admin</p>
                    </div>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <NavLink to="#" className="dropdown-item" onClick={() => {
                    window.location.href = "/logout";
                  }}>Logout</NavLink>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
        </Row>
      </Container>

    </div>
  )
}
