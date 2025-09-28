import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function SquareFunction(props: IconProps): React.ReactElement {
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
    id: "SquareFunction-master_svg0_745_10822"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#SquareFunction-master_svg0_745_10822)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1.333 12.667V3.333q0-.828.586-1.414t1.414-.586h9.334q.828 0 1.414.586t.586 1.414v9.334q0 .828-.586 1.414t-1.414.586H3.333q-.828 0-1.414-.586t-.586-1.414m1.334 0q0 .276.195.471t.471.195h9.334q.276 0 .471-.195t.195-.471V3.333q0-.276-.195-.471t-.471-.195H3.333q-.276 0-.471.195t-.195.471zm7.243-7.34q-.728-.1-1.05.23-.327.335-.327 1.11V6.8H9.8a.667.667 0 0 1 0 1.333H8.533v1.334q0 1.191-.616 1.841Q7.262 12 6 12a.667.667 0 0 1 0-1.333q.689 0 .95-.276.25-.264.25-.924V8.133H6A.667.667 0 0 1 6 6.8h1.2v-.133q0-1.318.706-2.041.791-.81 2.184-.62a.667.667 0 1 1-.18 1.321"
  })));
}
export default SquareFunction;