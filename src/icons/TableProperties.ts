import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function TableProperties(props: IconProps): React.ReactElement {
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
    id: "TableProperties-master_svg0_2994_24080"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#TableProperties-master_svg0_2994_24080)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M2,9L2,5Q2,3.7573600000000003,2.87868,2.878679Q3.7573600000000003,2,5,2L19,2Q20.2426,2,21.1213,2.878679Q22,3.7573600000000003,22,5L22,19Q22,20.2426,21.1213,21.1213Q20.2426,22,19,22L5,22Q3.7573600000000003,22,2.87868,21.1213Q2,20.2426,2,19L2,9ZM4,10L4,14L14,14L14,10L4,10ZM4,16L4,19Q4,20,5,20L14,20L14,16L4,16ZM16,20L19,20Q20,20,20,19L20,16L16,16L16,20ZM20,14L20,10L16,10L16,14L20,14ZM20,8L20,5Q20,4,19,4L16,4L16,8L20,8ZM14,4L14,8L4,8L4,5Q4,4,5,4L14,4Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default TableProperties;