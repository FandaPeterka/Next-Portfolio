import React from "react";
import "./Navbar.css";

const NavbarBrand = ({ brandIcon, brandText, brandSubText }) => {
  return (
    <div className="navbar-brand">
      <img src={brandIcon} alt="Developer Icon" />
      <p>
        {brandText}&nbsp;
        <span className="brand-subtext">|&nbsp;{brandSubText}</span>
      </p>
    </div>
  );
};

export default NavbarBrand;