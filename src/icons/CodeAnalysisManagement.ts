import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function CodeAnalysisManagement(props: IconProps): React.ReactElement {
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
    id: "CodeAnalysisManagement-master_svg0_1278_36893"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#CodeAnalysisManagement-master_svg0_1278_36893)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 3h5V1H4q-1.243 0-2.121.879Q1 2.757 1 4v5h2V4q0-.414.293-.707T4 3m16 0h-5V1h5q1.243 0 2.121.879Q23 2.757 23 4v5h-2V4q0-.414-.293-.707T20 3M5 17V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2m3.328-2.172-1.25-1.25L8.657 12l-1.579-1.578 1.25-1.25L11.157 12zM4 21h5v2H4q-1.243 0-2.121-.879Q1 21.243 1 20v-5h2v5q0 .414.293.707T4 21m16 0h-5v2h5q1.243 0 2.121-.879Q23 21.243 23 20v-5h-2v5q0 .414-.293.707T20 21m-3-10h-4v2h4z"
  })));
}
export default CodeAnalysisManagement;