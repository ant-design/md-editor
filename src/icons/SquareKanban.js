import * as React from "react";
function SquareKanban(props) {
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
    id: "SquareKanban-master_svg0_481_11978"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#SquareKanban-master_svg0_481_11978)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1.333 12.667V3.333q0-.828.586-1.414t1.414-.586h9.334q.828 0 1.414.586t.586 1.414v9.334q0 .828-.586 1.414t-1.414.586H3.333q-.828 0-1.414-.586t-.586-1.414m1.334 0q0 .276.195.471t.471.195h9.334q.276 0 .471-.195t.195-.471V3.333q0-.276-.195-.471t-.471-.195H3.333q-.276 0-.471.195t-.195.471zM5.333 4a.667.667 0 0 0-.666.667v4.666a.667.667 0 0 0 1.333 0V4.667A.667.667 0 0 0 5.333 4M8 4a.667.667 0 0 0-.667.667v2.666a.667.667 0 0 0 1.334 0V4.667A.667.667 0 0 0 8 4m2.667 0a.667.667 0 0 0-.667.667v6a.667.667 0 1 0 1.333 0v-6A.667.667 0 0 0 10.667 4"
  })));
}
export default SquareKanban;