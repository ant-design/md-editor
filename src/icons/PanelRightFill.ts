import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function PanelRightFill(props: IconProps): React.ReactElement {
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
    id: "PanelRightFill-master_svg0_2413_13469"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#PanelRightFill-master_svg0_2413_13469)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M2,6L2,18Q2,19.6569,3.17157,20.8284Q4.34315,22,6,22L18,22Q19.6569,22,20.8284,20.8284Q22,19.6569,22,18L22,6Q22,4.34315,20.8284,3.17157Q19.6569,2,18,2L6,2Q4.34315,2,3.17157,3.17157Q2,4.34315,2,6ZM6,20Q4,20,4,18L4,6Q4,4,6,4L18,4Q20,4,20,6L20,18Q20,20,18,20L6,20ZM13.5,19C12.6716,19,12,18.3284,12,17.5L12,6.5C12,5.67157,12.6716,5,13.5,5L17.5,5C18.3284,5,19,5.67157,19,6.5L19,17.5C19,18.3284,18.3284,19,17.5,19L13.5,19Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default PanelRightFill;