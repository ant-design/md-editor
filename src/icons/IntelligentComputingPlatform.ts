import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function IntelligentComputingPlatform(props: IconProps): React.ReactElement {
  return /*#__PURE__*/React.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 48 48",
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
    id: "IntelligentComputingPlatform-master_svg0_1_0642"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 48,
    height: 48,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#IntelligentComputingPlatform-master_svg0_1_0642)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M33.5 4.5H14.25a3.5 3.5 0 0 0-3.5 3.5v.25A3.25 3.25 0 0 1 7.5 11.5a3.25 3.25 0 0 0-3.25 3.25v19.5A3.25 3.25 0 0 0 7.5 37.5h.25a3 3 0 0 1 3 3 3 3 0 0 0 3 3H34.5a2.25 2.25 0 0 0 2.25-2.25A2.25 2.25 0 0 1 39 39h1.25a3.5 3.5 0 0 0 3.5-3.5v-3.25A3.25 3.25 0 0 0 40.5 29a3.25 3.25 0 0 1-3.25-3.25V25a4 4 0 0 0-3.5-3.97V21h-2v.03a4 4 0 0 0-3.5 3.97v1a4 4 0 0 0 3.5 3.97V30h1.75a3.25 3.25 0 0 1 0 6.5H15.25a4 4 0 0 1-4-4v-17a4 4 0 0 1 4-4h17.5a4 4 0 0 1 4 4v1a3.5 3.5 0 1 0 7 0v-2a3.5 3.5 0 0 0-3.5-3.5H40a3.25 3.25 0 0 1-3.25-3.25A3.25 3.25 0 0 0 33.5 4.5M31.75 14a2 2 0 0 1 2 2v3h-2v-1.5a1.5 1.5 0 0 0-1.5-1.5h-13a1.5 1.5 0 0 0-1.5 1.5v13a1.5 1.5 0 0 0 1.5 1.5h16.5a2 2 0 0 1-2 2h-16a2 2 0 0 1-2-2V16a2 2 0 0 1 2-2z"
  })));
}
export default IntelligentComputingPlatform;