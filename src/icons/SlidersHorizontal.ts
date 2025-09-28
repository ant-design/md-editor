import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function SlidersHorizontal(props: IconProps): React.ReactElement {
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
    id: "SlidersHorizontal-master_svg0_280_9985"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#SlidersHorizontal-master_svg0_280_9985)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 2v-.667a.667.667 0 0 0-1.333 0V4A.667.667 0 0 0 10 4v-.667h4A.667.667 0 0 0 14 2zM2 3.333h4.667a.667.667 0 0 0 0-1.333H2a.667.667 0 0 0 0 1.333M5.333 10A.667.667 0 0 0 6 9.333V6.667a.667.667 0 0 0-1.333 0v.666H2a.667.667 0 1 0 0 1.334h2.667v.666c0 .368.298.667.666.667M8 8.667h6a.667.667 0 0 0 0-1.334H8a.667.667 0 1 0 0 1.334m3.333 6V14H14a.667.667 0 1 0 0-1.333h-2.667V12A.667.667 0 0 0 10 12v2.667a.667.667 0 1 0 1.333 0M2 14h6a.667.667 0 1 0 0-1.333H2A.667.667 0 0 0 2 14"
  })));
}
export default SlidersHorizontal;