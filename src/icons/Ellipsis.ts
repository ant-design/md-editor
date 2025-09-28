import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Ellipsis(props: IconProps): React.ReactElement {
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
    id: "Ellipsis-master_svg0_2771_15083"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Ellipsis-master_svg0_2771_15083)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M14,12C14,13.104569999999999,13.1046,14,12,14C10.895430000000001,14,10,13.104569999999999,10,12C10,10.89543,10.895430000000001,10,12,10C13.1046,10,14,10.89543,14,12ZM21,12C21,13.104569999999999,20.1046,14,19,14C17.895400000000002,14,17,13.104569999999999,17,12C17,10.89543,17.895400000000002,10,19,10C20.1046,10,21,10.89543,21,12ZM7,12C7,13.104569999999999,6.10457,14,5,14C3.89543,14,3,13.104569999999999,3,12C3,10.89543,3.89543,10,5,10C6.10457,10,7,10.89543,7,12Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default Ellipsis;