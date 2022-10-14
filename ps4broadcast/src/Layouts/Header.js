import React from "react";
import { Link } from "react-router-dom";
import logoImage from "../Assets/Image/Logo192.png";
import "./Header.css";

function Header() {
  return (
    <>
      <Link to={"/"}>
        <img className="logo" src={logoImage} alt="ps4broadcast" />
      </Link>
    </>
  );
}

export default Header;