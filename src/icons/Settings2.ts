import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Settings2(props: IconProps): React.ReactElement {
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
    id: "Settings2-master_svg0_341_9085"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Settings2-master_svg0_341_9085)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7.25 5.328a2.668 2.668 0 1 1 0-1.323A1 1 0 0 1 7.334 4h6a.667.667 0 1 1 0 1.333h-6a1 1 0 0 1-.082-.005M6 4.667a1.333 1.333 0 1 0-2.667 0 1.333 1.333 0 0 0 2.667 0m8 6.666A2.667 2.667 0 0 1 8.75 12H3.334a.667.667 0 0 1 0-1.333h5.418a2.668 2.668 0 0 1 5.249.666m-4 0a1.333 1.333 0 1 0 2.667 0 1.333 1.333 0 0 0-2.667 0"
  })));
}
export default Settings2;