import * as React from "react";
function ChevronRight(props) {
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
    id: "ChevronRight-master_svg0_388_03624"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#ChevronRight-master_svg0_388_03624)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m10.471 7.529-4-4a.667.667 0 1 0-.942.942L9.057 8 5.53 11.528a.667.667 0 1 0 .942.943l4-4a.667.667 0 0 0 0-.942"
  })));
}
export default ChevronRight;