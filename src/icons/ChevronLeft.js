import * as React from "react";
function ChevronLeft(props) {
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
    id: "ChevronLeft-master_svg0_388_03620"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#ChevronLeft-master_svg0_388_03620)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10.667 4c0 .177-.07.346-.196.471L6.943 8l3.528 3.529a.667.667 0 0 1-.942.942l-4-4a.667.667 0 0 1 0-.942l4-4A.667.667 0 0 1 10.666 4"
  })));
}
export default ChevronLeft;