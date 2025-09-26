import * as React from "react";
function FitCanvas(props) {
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
    id: "FitCanvas-master_svg0_383_02239"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#FitCanvas-master_svg0_383_02239)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3.333 2.667q-.276 0-.471.195t-.195.471v1.334a.667.667 0 1 1-1.334 0V3.333q0-.828.586-1.414t1.414-.586h1.334a.667.667 0 1 1 0 1.334zm8-1.334h1.334q.828 0 1.414.586t.586 1.414v1.334a.667.667 0 1 1-1.334 0V3.333q0-.276-.195-.471t-.471-.195h-1.334a.667.667 0 1 1 0-1.334m-8 5.334v2.666q0 .829.586 1.415.586.585 1.414.585h5.334q.828 0 1.414-.585.586-.586.586-1.415V6.667q0-.829-.586-1.415-.586-.585-1.414-.585H5.333q-.828 0-1.414.585-.586.586-.586 1.415m1.529 3.138q-.195-.196-.195-.472V6.667q0-.276.195-.472T5.333 6h5.334q.276 0 .471.195.195.196.195.472v2.666q0 .276-.195.472t-.471.195H5.333q-.276 0-.471-.195M2 10.667a.667.667 0 0 0-.667.666v1.334q0 .828.586 1.414t1.414.586h1.334a.667.667 0 1 0 0-1.334H3.333q-.276 0-.471-.195t-.195-.471v-1.334A.667.667 0 0 0 2 10.667m11.333.666a.667.667 0 0 1 1.334 0v1.334q0 .828-.586 1.414t-1.414.586h-1.334a.667.667 0 1 1 0-1.334h1.334q.276 0 .471-.195t.195-.471z"
  })));
}
export default FitCanvas;