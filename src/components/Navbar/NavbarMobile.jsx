"use client";
import React from "react";
import { FiMenu, FiX } from "react-icons/fi";
import "./Navbar.css";

const NavbarMobile = ({ menuOpen, toggleMenu, mobileLinks }) => {
  return (
    <>
      <div className="mobile-menu-icon" onClick={toggleMenu} aria-label="Toggle mobile menu" role="button" tabIndex="0">
        {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
      </div>
      {menuOpen && (
        <div className="mobile-dropdown mobile" role="menu" aria-label="Mobile Navigation">
          {mobileLinks}
        </div>
      )}
    </>
  );
};

export default NavbarMobile;