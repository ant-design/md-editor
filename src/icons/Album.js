import * as React from "react";
function Album(props) {
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
    id: "Album-master_svg0_2967_14252"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Album-master_svg0_2967_14252)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M2,5L2,19Q2,20.2426,2.87868,21.1213Q3.7573600000000003,22,5,22L19,22Q20.2426,22,21.1213,21.1213Q22,20.2426,22,19L22,5Q22,3.7573600000000003,21.1213,2.87868Q20.2426,2,19,2L5,2Q3.7573600000000003,2,2.87868,2.87868Q2,3.7573600000000003,2,5ZM17,4C17.552300000000002,4,18,4.44772,18,5L18,11C18,11.26522,17.8946,11.51957,17.7071,11.70711C17.5196,11.89464,17.2652,12,17,12C16.7348,12,16.4804,11.89464,16.2929,11.70711L14,9.41421L11.70711,11.70711C11.51957,11.89464,11.26522,12,11,12C10.44771,12,10,11.55228,10,11L10,5C10,4.44772,10.44771,4,11,4L17,4Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default Album;