import * as React from "react";
function Terminal(props) {
  return /*#__PURE__*/React.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    fillRule: "evenodd"
  }, props, {
    style: Object.assign({
      verticalAlign: '-0.125em'
    }, props.style),
    className: ['sofa-icons-icon', props.className].filter(Boolean).join(' '),
    width: "1em",
    height: "1em"
  }), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
    id: "Terminal-master_svg0_549_14753"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Terminal-master_svg0_549_14753)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1.038 19.793 3.822 4.207C4.04 2.988 5.125 2 6.245 2h15.083c1.12 0 1.851.988 1.634 2.207l-2.784 15.586C19.96 21.012 18.875 22 17.755 22H2.672c-1.12 0-1.851-.988-1.634-2.207m10.54-8.19-8.206 6.619 1.256 1.556 9.794-7.898-7.156-8.523-1.532 1.286zM10 18h8v2h-8z",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default Terminal;