import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function CirclePause(props: IconProps): React.ReactElement {
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
    id: "CirclePause-master_svg0_481_11997"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#CirclePause-master_svg0_481_11997)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15.333 8A7.333 7.333 0 1 1 .667 8a7.333 7.333 0 0 1 14.666 0M14 8A6 6 0 1 0 2 8a6 6 0 0 0 12 0m-7.333 2.667A.667.667 0 0 1 6 10V6a.667.667 0 0 1 1.333 0v4a.667.667 0 0 1-.666.667m2.666 0A.667.667 0 0 1 8.667 10V6A.667.667 0 0 1 10 6v4a.667.667 0 0 1-.667.667"
  })));
}
export default CirclePause;