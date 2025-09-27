import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function RuleTree(props: IconProps): React.ReactElement {
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
    id: "RuleTree-master_svg0_1231_36600"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#RuleTree-master_svg0_1231_36600)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 2a1 1 0 0 0-1 1v13q0 1.243.879 2.121Q3.757 19 5 19h3a1 1 0 1 0 0-2H5q-.414 0-.707-.293T4 16V7.83Q4.481 8 5 8h3a1 1 0 0 0 0-2H5q-.414 0-.707-.293T4 5V3a1 1 0 0 0-1-1m8 6V5q0-1.243.879-2.121Q12.757 2 14 2h5q1.243 0 2.121.879Q22 3.757 22 5v3q0 1.243-.879 2.121Q20.243 11 19 11h-5q-1.243 0-2.121-.879Q11 9.243 11 8m2 0q0 .414.293.707T14 9h5q.414 0 .707-.293T20 8V5q0-.414-.293-.707T19 4h-5q-.414 0-.707.293T13 5zm-2 11v-3q0-1.243.879-2.121Q12.757 13 14 13h5q1.243 0 2.121.879Q22 14.757 22 16v3q0 1.243-.879 2.121Q20.243 22 19 22h-5q-1.243 0-2.121-.879Q11 20.243 11 19m2 0q0 .414.293.707T14 20h5q.414 0 .707-.293T20 19v-3q0-.414-.293-.707T19 15h-5q-.414 0-.707.293T13 16z",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default RuleTree;