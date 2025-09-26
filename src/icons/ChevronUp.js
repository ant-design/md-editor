import * as React from "react";
function ChevronUp(props) {
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
    id: "ChevronUp-master_svg0_308_02274"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#ChevronUp-master_svg0_308_02274)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m3.529 9.529 4-4a.667.667 0 0 1 .942 0l4 4a.667.667 0 0 1-.942.942l-3.53-3.528-3.528 3.528a.667.667 0 1 1-.942-.942",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default ChevronUp;