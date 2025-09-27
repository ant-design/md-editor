import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Check(props: IconProps): React.ReactElement {
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
    id: "Check-master_svg0_280_33510"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Check-master_svg0_280_33510)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M14 4.667c0 .176-.07.346-.195.471l-6.667 6.667a.667.667 0 0 1-.943 0L2.862 8.472a.667.667 0 1 1 .943-.943l2.862 2.862 6.195-6.195a.667.667 0 0 1 1.138.47",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default Check;