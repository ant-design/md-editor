import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Frown(props: IconProps): React.ReactElement {
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
    id: "Frown-master_svg0_709_09806"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Frown-master_svg0_709_09806)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 15.333A7.333 7.333 0 1 0 8 .667a7.333 7.333 0 0 0 0 14.666M8 2a6 6 0 1 1 0 12A6 6 0 0 1 8 2M6 6.667a.667.667 0 1 0 0-1.334.667.667 0 0 0 0 1.334m4 0a.667.667 0 1 0 0-1.334.667.667 0 0 0 0 1.334m-5.2 3.6q1.2-1.6 3.2-1.6t3.2 1.6a.666.666 0 1 1-1.067.8Q9.333 10 8 10t-2.133 1.066a.667.667 0 1 1-1.067-.8"
  })));
}
export default Frown;