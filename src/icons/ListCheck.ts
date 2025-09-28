import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function ListCheck(props: IconProps): React.ReactElement {
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
    id: "ListCheck-master_svg0_961_25731"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#ListCheck-master_svg0_961_25731)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 3.333h8.667a.667.667 0 1 1 0 1.334H2a.667.667 0 1 1 0-1.334m0 4h8.667a.667.667 0 0 1 0 1.334H2a.667.667 0 1 1 0-1.334m0 4h5.333a.667.667 0 0 1 0 1.334H2a.667.667 0 1 1 0-1.334m12.667-.666c0 .176-.07.346-.196.471l-2.666 2.667a.667.667 0 0 1-.943 0L9.529 12.47a.667.667 0 0 1 .942-.942l.862.862 2.195-2.195a.667.667 0 0 1 1.139.47",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default ListCheck;