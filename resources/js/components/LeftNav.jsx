import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Category, Logout, EmailIcon, EmployeeIcon, DocomentIcon, ProjectIcon, QuestionIcon, CloseIcon } from "./svg-icons/icons";
import "../../css/Nav.css";
import { Menuicon } from '../components/svg-icons/icons';

export default function LeftNav({isMenuOpen, setIsMenuOpen}) {

  // const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
 


  return (
    <nav className={`sideNavOuter`}>

      <div className="sideNavLogo">
        {/* <button onClick={toggleMenu} className="toggleMenu MenuOpen nav-bar-close" ><CloseIcon /></button> */}
        {/* <img src="/assets/images/GOOD_DO_NOT_TOUCH_1.jpg" alt="Logo" /> */}

        <hr className="sideBorder" />
      </div>
      <ul className="sideNavList">
        {Config.user.role === 'Admin' ?
          <>
            <li className={`sideNavItem`}>
              <NavLink
                to="/pages/users"
                className={ location.pathname == "/pages/users" ? "active" : ""}
                onClick={() => {
                  if (isMenuOpen) {
                    setIsMenuOpen(false);
                  }
                }}
              >
                <EmployeeIcon />
                Users
              </NavLink>
            </li>

            <li className="sideNavItem">
              <NavLink
                to="/pages/products"
                className={location.pathname == "/pages/products" ? "active" : ""}
              >
                <ProjectIcon />
                Products
              </NavLink>

            </li>
          </>
          :
          <>
            <li className="sideNavItem">
              <NavLink
                to="/pages/products"
                className={location.pathname == "/pages/products" ? "active" : ""}
              >
                <ProjectIcon />
                Products
              </NavLink>

            </li>
          </>
        }

        <li className="sideNavItem LogoutMenu">
          <NavLink to="#" className="dropdown-item" onClick={() => {
            window.location.href = "/logout";
          }}><Logout /> Logout</NavLink>
        </li>
      </ul>

    </nav>
  );
}

