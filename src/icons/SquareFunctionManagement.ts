import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function SquareFunctionManagement(props: IconProps): React.ReactElement {
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
    id: "SquareFunctionManagement-master_svg0_1036_31549"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#SquareFunctionManagement-master_svg0_1036_31549)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 5v14q0 1.243.879 2.121Q3.757 22 5 22h14q1.243 0 2.121-.879Q22 20.243 22 19V5q0-1.243-.879-2.121Q20.243 2 19 2H5q-1.243 0-2.121.879Q2 3.757 2 5m6.5 11q1.38 0 1.974-.51Q11 15.04 11 14v-2H8.5v-2H11q0-1.96 1.224-3.01Q13.38 6 15.5 6v2q-1.38 0-1.974.51Q13 8.96 13 10h2.5v2H13v2q0 1.96-1.224 3.01Q10.62 18 8.5 18z"
  })));
}
export default SquareFunctionManagement;