import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function AiPaaS(props: IconProps): React.ReactElement {
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
    id: "AiPaaS-master_svg0_1063_40255"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 48,
    height: 48,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#AiPaaS-master_svg0_1063_40255)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m1.61 23.608 9.877-10.28A4.31 4.31 0 0 1 14.597 12h18.806c1.172 0 2.294.48 3.11 1.328l9.877 10.28c.799.831.815 2.146.037 2.997l-3.22 3.52-15.152-15.452a5.657 5.657 0 0 0-8.11 0L4.792 30.124l-3.219-3.52a2.194 2.194 0 0 1 .037-2.996m3.874 7.272 8.643-8.813a4.31 4.31 0 0 1 3.08-1.296h13.586c1.157 0 2.266.467 3.08 1.296l8.643 8.813-2.424 2.65a2.153 2.153 0 0 1-3.151.035l-8.117-8.495a5.66 5.66 0 0 0-8.215 0l-8.85 9.262a2.153 2.153 0 0 1-3.15-.035z"
  })));
}
export default AiPaaS;