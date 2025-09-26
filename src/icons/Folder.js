import * as React from "react";
function Folder(props) {
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
    id: "Folder-master_svg0_2_09"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Folder-master_svg0_2_09)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 21q-1.243 0-2.121-.879Q1 19.243 1 18V5q0-1.243.879-2.121Q2.757 2 4 2h3.93q1.616 0 2.499 1.34l.816 1.21q.3.455.855.45H20q1.243 0 2.121.879Q23 6.757 23 8v10q0 1.243-.879 2.121Q21.243 21 20 21zm0-2h16q1 0 1-1V8q0-.414-.293-.707T20 7h-7.9q-1.626.016-2.525-1.35L8.77 4.46Q8.468 4 7.93 4H4Q3 4 3 5v13q0 1 1 1",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default Folder;