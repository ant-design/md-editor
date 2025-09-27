import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function ChevronDown(props: IconProps): React.ReactElement {
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
    id: "ChevronDown-master_svg0_172_371"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    y: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#ChevronDown-master_svg0_172_371)",
    transform: "matrix(1 0 0 -1 0 32)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m11.862 26.471-3.529-3.528-3.528 3.528a.667.667 0 1 1-.943-.942l4-4a.667.667 0 0 1 .943 0l4 4a.667.667 0 0 1-.943.942",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default ChevronDown;