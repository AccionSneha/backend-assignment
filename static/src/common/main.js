import React from "react";

import Header from "./header.js";
import Footer from "./footer.js";
import Index from "../router.js";
import OnFireMixin from "../mixins/onFireMixin.js";

const MainComponent = React.createClass({
  __ONFIRE__: "MainComponent",
  mixins: [OnFireMixin], // 引入 mixin
  render: function () {
    let children = this.props.children || <Index />;
    return (
      <div>
        <Header />
        {children}
        <Footer />
      </div>
    );
  },
});

export default MainComponent;
