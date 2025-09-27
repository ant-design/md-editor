import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function BusinessSystem(props: IconProps): React.ReactElement {
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
    id: "BusinessSystem-master_svg0_235_38741"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#BusinessSystem-master_svg0_235_38741)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2.5 10V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1M13 8.5V6a3 3 0 0 1 3-3h2.5a3 3 0 0 1 3 3v2.5a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3m.5 11.5v-6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1m-5.859-6.98 3.71 6.366c.193.333.2.737.014 1.075-.184.334-.53.54-.906.539H3.04c-.374 0-.718-.208-.903-.541a1.1 1.1 0 0 1 .009-1.073L5.85 13.02c.178-.316.52-.515.893-.519.365 0 .704.197.892.52z",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default BusinessSystem;