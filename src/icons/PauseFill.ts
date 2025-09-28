import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function PauseFill(props: IconProps): React.ReactElement {
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
    id: "PauseFill-master_svg0_2177_25339"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#PauseFill-master_svg0_2177_25339)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 5v14q0 .828.586 1.414T7 21h2q.828 0 1.414-.586T11 19V5q0-.828-.586-1.414T9 3H7q-.828 0-1.414.586T5 5m8 0v14q0 .828.586 1.414T15 21h2q.828 0 1.414-.586T19 19V5q0-.828-.586-1.414T17 3h-2q-.828 0-1.414.586T13 5",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default PauseFill;