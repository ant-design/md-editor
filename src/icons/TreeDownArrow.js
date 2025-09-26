import * as React from "react";
function TreeDownArrow(props) {
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
    id: "TreeDownArrow-master_svg0_2281_13360"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#TreeDownArrow-master_svg0_2281_13360)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m8.54 10.253 3.146 3.147a1 1 0 0 0 1.414 0l3.147-3.147a.5.5 0 0 0-.354-.853h-7a.5.5 0 0 0-.354.853"
  })));
}
export default TreeDownArrow;