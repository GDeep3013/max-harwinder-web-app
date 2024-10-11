import LeftNav from '../components/LeftNav';
import HeaderDashboard from '../components/HeaderDashboard'
import React, { useState } from "react";
import { MobileMenuBar } from '../components/svg-icons/icons';

export default function AuthLayout({ children, title, subTitle }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <div className='wrapper-outer d-flex'>
      {
        Config.user.role == "Admin" && <>
          <div className={`side-nav ${isMenuOpen ? "sidenavMobile" : ""}`}>
            <LeftNav isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          </div>

          <div className='main-content'>
            <div className="dashboard-logo">

              <img src="/assets/images/GOOD_DO_NOT_TOUCH_1.jpg" alt="Logo" />
            </div>
            <div class="product-top-header">
              <div className="sideNavLogo">


                <button onClick={toggleMenu} className="toggleMenu MenuOpen" ><MobileMenuBar /></button>
                <hr className="sideBorder" />
              </div>
              <HeaderDashboard title={title} subTitle={subTitle} />
              {children}
            </div>
          </div>
        </>
      }
    </div>
  );
}
