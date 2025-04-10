"use client";
import React from "react";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import "./Navbar.css";

const NavbarSwitchers = () => {
  return (
    <div className="navbar-switchers" role="group" aria-label="Navigation Switchers">
      <ThemeToggle />
      <LanguageSwitcher />
    </div>
  );
};

export default NavbarSwitchers;