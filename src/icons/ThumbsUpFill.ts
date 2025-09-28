import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function ThumbsUpFill(props: IconProps): React.ReactElement {
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
    id: "ThumbsUpFill-master_svg0_2804_14194"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#ThumbsUpFill-master_svg0_2804_14194)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M1,20C1,21.6569,2.34315,23,4,23L6,23L6,9L4,9C2.34315,9,1,10.34315,1,12L1,20ZM8,23L17.7371,23C19.0765,23,20.2537,22.1121,20.6217,20.8242L22.9074,12.8242C23.4549,10.90771,22.0159,9,20.0228,9L15.5,9L16.1833,5.35581C16.6077,3.09232,14.8712,1,12.5683,1C12.22,1,11.9016,1.196775,11.7459,1.5082870000000002L8,9L8,23Z"
  }))));
}
export default ThumbsUpFill;