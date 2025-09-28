import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function ChevronsRightLeft(props: IconProps): React.ReactElement {
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
    id: "ChevronsRightLeft-master_svg0_366_15718"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#ChevronsRightLeft-master_svg0_366_15718)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6.471 7.529 3.138 4.195a.667.667 0 1 0-.943.943L5.057 8l-2.861 2.862a.667.667 0 1 0 .942.943L6.471 8.47a.667.667 0 0 0 0-.942M14 4.667c0 .176-.07.346-.195.471L10.943 8l2.862 2.862a.666.666 0 1 1-.943.943L9.529 8.47a.667.667 0 0 1 0-.942l3.333-3.333a.667.667 0 0 1 1.138.47"
  })));
}
export default ChevronsRightLeft;