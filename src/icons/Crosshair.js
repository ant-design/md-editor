import * as React from "react";
function Crosshair(props) {
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
    id: "Crosshair-master_svg0_2432_15981"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Crosshair-master_svg0_2432_15981)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M12,23C18.0751,23,23,18.0751,23,12C23,5.92487,18.0751,1,12,1C5.92487,1,1,5.92487,1,12C1,18.0751,5.92487,23,12,23ZM11,20.9451C6.82838,20.4839,3.51608,17.1716,3.05493,13L6,13C6.55228,13,7,12.5523,7,12C7,11.4477,6.55228,11,6,11L3.05493,11C3.51608,6.82838,6.82838,3.51608,11,3.05493L11,6C11,6.55228,11.4477,7,12,7C12.5523,7,13,6.55228,13,6L13,3.05493C17.1716,3.51608,20.4839,6.82838,20.9451,11L18,11C17.4477,11,17,11.4477,17,12C17,12.5523,17.4477,13,18,13L20.9451,13C20.4839,17.1716,17.1716,20.4839,13,20.9451L13,18C13,17.4477,12.5523,17,12,17C11.4477,17,11,17.4477,11,18L11,20.9451Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default Crosshair;