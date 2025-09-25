import * as React from "react";
function Signpost(props) {
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
    id: "Signpost-master_svg0_1308_37655"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Signpost-master_svg0_1308_37655)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2a1 1 0 0 0-1 1v2H6q-1.21 0-2.08.84L1.612 8.06q-.612.59-.612 1.44t.612 1.44l2.306 2.22Q4.789 14 6 14h5v7a1 1 0 1 0 2 0v-7h5q1.21 0 2.08-.84l2.308-2.22Q23 10.35 23 9.5t-.613-1.44l-2.306-2.22Q19.211 5 18 5h-5V3a1 1 0 0 0-1-1m0 10h6q.403 0 .694-.28L21 9.5l-2.307-2.22Q18.403 7 18 7H6q-.403 0-.693.28L3 9.5l2.306 2.22q.29.28.693.28z",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default Signpost;