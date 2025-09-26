import * as React from "react";
function Blocks(props) {
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
    id: "Blocks-master_svg0_2986_14260"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Blocks-master_svg0_2986_14260)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M13,9L13,3Q13,2.17157,13.5858,1.5857860000000001Q14.1716,1,15,1L21,1Q21.8284,1,22.4142,1.5857860000000001Q23,2.17157,23,3L23,9Q23,9.82843,22.4142,10.41421Q21.8284,11,21,11L15,11Q14.1716,11,13.5858,10.41421Q13,9.82843,13,9ZM15,9L21,9L21,3L15,3L15,9ZM1,20L1,8Q1,6.75736,1.878679,5.87868Q2.7573600000000003,5,4,5L9,5Q11,5,11,7L11,13L17,13Q19,13,19,15L19,20Q19,21.2426,18.1213,22.1213Q17.2426,23,16,23L4,23Q2.7573600000000003,23,1.8786800000000001,22.1213Q1,21.2426,1,20ZM9,13L9,7L4,7Q3,7,3,8L3,13L9,13ZM3,15L3,20Q3,21,4,21L9,21L9,15L3,15ZM11,15L11,21L16,21Q17,21,17,20L17,15L11,15Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default Blocks;