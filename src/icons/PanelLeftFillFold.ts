import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function PanelLeftFillFold(props: IconProps): React.ReactElement {
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
    id: "PanelLeftFillFold-master_svg0_2774_15228"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#PanelLeftFillFold-master_svg0_2774_15228)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M2,18L2,6Q2,4.34315,3.17157,3.17157Q4.34315,2,6,2L18,2Q19.6569,2,20.8284,3.17157Q22,4.34315,22,6L22,18Q22,19.6569,20.8284,20.8284Q19.6569,22,18,22L6,22Q4.34315,22,3.17157,20.8284Q2,19.6569,2,18ZM4,18Q4,20,6,20L18,20Q20,20,20,18L20,6Q20,4,18,4L6,4Q4,4,4,6L4,18ZM7.00098,18L7.00098,6C7.00098,5.44772,6.55326,5,6.00098,5C5.44869,5,5.00098,5.44772,5.00098,6L5.00098,18C5.00098,18.5523,5.44869,19,6.00098,19C6.55326,19,7.00098,18.5523,7.00098,18Z"
  }))));
}
export default PanelLeftFillFold;