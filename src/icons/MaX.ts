import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function MaX(props: IconProps): React.ReactElement {
  return /*#__PURE__*/React.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 48 48",
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
    id: "MaX-master_svg0_1_0545"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 48,
    height: 48,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#MaX-master_svg0_1_0545)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m2 32 3.485 4 21.764-7.09 3.94 5.89h6.534L46 22.8l-3.485-4.4-12.026 4.084L24.5 24.5l-13.787 4.7 8.3-12.605 4.32 6.46 5.125-1.708L22.04 12h-6.1zm32.673-1.6-2.193-3.195 5.44-1.772z"
  })));
}
export default MaX;