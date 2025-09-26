import * as React from "react";
function Plus(props) {
  return /*#__PURE__*/React.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 16 16",
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
    id: "Plus-master_svg0_334_00882"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Plus-master_svg0_334_00882)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 2.667a.667.667 0 0 0-.667.666v4h-4a.667.667 0 1 0 0 1.334h4v4a.667.667 0 1 0 1.334 0v-4h4a.667.667 0 1 0 0-1.334h-4v-4A.667.667 0 0 0 8 2.667"
  })));
}
export default Plus;