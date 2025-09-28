import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function ChevronsLeftRight(props: IconProps): React.ReactElement {
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
    id: "ChevronsLeftRight-master_svg0_366_15713"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#ChevronsLeftRight-master_svg0_366_15713)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6.667 4.667c0 .176-.07.346-.196.471L3.61 8l2.862 2.862a.667.667 0 1 1-.942.943L2.195 8.47a.667.667 0 0 1 0-.942l3.333-3.333a.667.667 0 0 1 1.139.47m7.138 2.862L10.47 4.195a.667.667 0 1 0-.942.943L12.39 8 9.53 10.862a.667.667 0 1 0 .942.943l3.334-3.334a.666.666 0 0 0 0-.942"
  })));
}
export default ChevronsLeftRight;