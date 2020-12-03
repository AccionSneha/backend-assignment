import React from "react";
import { Link } from "react-router";

const Footer = React.createClass({
  render: function () {
    return (
      <p className="footer">
        <Link to="/">Redis Monitor</Link>
      </p>
    );
  },
});

export default Footer;
