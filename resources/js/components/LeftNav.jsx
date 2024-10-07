import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Category, Logout, EmailIcon, EmployeeIcon, DocomentIcon, ProjectIcon, QuestionIcon, FixedPrice } from "./svg-icons/icons";
import "../../css/Nav.css";
import { Menuicon } from '../components/svg-icons/icons';

export default function LeftNav() {

  // const user = useSelector((state) => state.auth.user);

  const toggleMenu = () => {
    // setIsMenuOpen(!isMenuOpen);
    console.log("toggle Manu")
  };



  return (
    <nav className={`sideNavOuter`}>

      <div className="sideNavLogo">
        <button onClick={toggleMenu} className="toggleMenu MenuOpen" ><Menuicon /></button>
        <img src="/assets/images/logoheader.svg" alt="Logo" />

        <hr className="sideBorder" />
      </div>
      <ul className="sideNavList">
        {Config.user.role === 'Admin' ?
          <>
            <li className={`sideNavItem`}>
              <NavLink
                to="/pages/users"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <EmployeeIcon />
                Users
              </NavLink>
            </li>

            <li className="sideNavItem">
              <NavLink
                to="/pages/products"
                className={({ isActive }) => (isActive ? 'active' : '')}
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
                className={({ isActive }) => (isActive ? 'active' : '')}
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

