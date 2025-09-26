import * as React from "react";
function Compass(props) {
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
    id: "Compass-master_svg0_2432_16138"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Compass-master_svg0_2432_16138)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M23 12c0 6.075-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1s11 4.925 11 11m-2 0a9 9 0 1 0-18 0 9 9 0 0 0 18 0m-5.076-5.189-5.411 1.804q-1.423.475-1.898 1.898l-1.804 5.41a1 1 0 0 0 1.265 1.266l5.411-1.804q1.423-.475 1.898-1.898l1.804-5.41a1 1 0 0 0-1.265-1.266m-5.411 4.334q.158-.474.632-.632L14.66 9.34l-1.172 3.514q-.158.474-.632.632L9.34 14.66z",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default Compass;