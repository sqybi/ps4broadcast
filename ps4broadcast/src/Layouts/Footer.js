import React from "react";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <center>
      <span>2022-{year === 2022 ? "" : year} © sqybi</span>
    </center>
  );
}

export default Footer;