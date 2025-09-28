import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function PanelLeftFill(props: IconProps): React.ReactElement {
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
    id: "PanelLeftFill-master_svg0_2413_13464"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#PanelLeftFill-master_svg0_2413_13464)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M2,6L2,18Q2,19.6569,3.17157,20.8284Q4.34315,22,6,22L18,22Q19.6569,22,20.8284,20.8284Q22,19.6569,22,18L22,6Q22,4.34315,20.8284,3.17157Q19.6569,2,18,2L6,2Q4.34315,2,3.17157,3.17157Q2,4.34315,2,6ZM6,20Q4,20,4,18L4,6Q4,4,6,4L18,4Q20,4,20,6L20,18Q20,20,18,20L6,20ZM5,17.5L5,6.5C5,5.67157,5.67157,5,6.5,5L10.5,5C11.32843,5,12,5.67157,12,6.5L12,17.5C12,18.3284,11.32843,19,10.5,19L6.5,19C5.67157,19,5,18.3284,5,17.5Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default PanelLeftFill;