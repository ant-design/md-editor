import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Variable(props: IconProps): React.ReactElement {
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
    id: "Variable-master_svg0_1231_36607"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Variable-master_svg0_1231_36607)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6.4 2.2Q2 5.5 2 12q0 6.497 4.397 9.798l.003.002a1 1 0 1 0 1.2-1.6Q4 17.5 4 12t3.6-8.2a1 1 0 1 0-1.2-1.6m10.2 0Q21 5.5 21 12q0 6.497-4.397 9.798l-.003.002a1 1 0 1 1-1.2-1.6Q19 17.5 19 12t-3.6-8.2a1 1 0 0 1 1.2-1.6M9.707 15.707 12 13.414l2.293 2.293a1 1 0 1 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default Variable;