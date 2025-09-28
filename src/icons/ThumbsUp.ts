import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function ThumbsUp(props: IconProps): React.ReactElement {
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
    id: "ThumbsUp-master_svg0_709_09818"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#ThumbsUp-master_svg0_709_09818)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M4,23C2.34315,23,1,21.6569,1,20L1,12C1,10.34315,2.34315,9,4,9L6,9L6,23L4,23ZM3,20L3,12C3,11.4477,3.44772,11,4,11L4,21C3.44772,21,3,20.5523,3,20ZM17.7371,23L8,23L8,9L11.7459,1.5082870000000002C11.9016,1.196775,12.22,1,12.5683,1C14.8712,1,16.6077,3.09232,16.1833,5.35581L15.5,9L20.0228,9C22.0159,9,23.4549,10.90771,22.9074,12.8242L20.6217,20.8242C20.2537,22.1121,19.0765,23,17.7371,23ZM17.756,21L10,21L10,10L12.9065,3.70269C12.9635,3.57913,13.0871,3.5,13.2232,3.5C13.8837,3.5,14.3791,4.10428,14.2496,4.75197L13.2392,9.80388C13.1155,10.42268,13.5888,11,14.2198,11L20.156,11C20.8258,11,21.3063,11.6457,21.1138,12.2873L18.7138,20.2873C18.5869,20.7103,18.1976,21,17.756,21Z"
  }))));
}
export default ThumbsUp;