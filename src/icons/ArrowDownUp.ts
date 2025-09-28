import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function ArrowDownUp(props: IconProps): React.ReactElement {
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
    id: "ArrowDownUp-master_svg0_1017_27040"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#ArrowDownUp-master_svg0_1017_27040)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3.333 1.333h9.334a.667.667 0 1 1 0 1.334H3.333a.667.667 0 1 1 0-1.334m1.529 4.862L7.529 3.53a.665.665 0 0 1 .942 0l2.667 2.666a.667.667 0 0 1-.943.943L8.667 5.61v4.78l1.528-1.528a.667.667 0 1 1 .943.943L8.471 12.47a.667.667 0 0 1-.942 0L4.862 9.805a.667.667 0 0 1 .943-.943l1.528 1.529V5.61L5.805 7.138a.667.667 0 0 1-.943-.943m7.805 7.138a.667.667 0 0 1 0 1.334H3.333a.667.667 0 1 1 0-1.334z",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default ArrowDownUp;