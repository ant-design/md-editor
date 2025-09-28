import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Information(props: IconProps): React.ReactElement {
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
    id: "Information-master_svg0_1_3950"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Information-master_svg0_1_3950)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 7v11q0 1.243.879 2.121Q2.757 21 4 21h16q1.243 0 2.121-.879.88-.878.88-2.121V6q0-1.243-.88-2.121Q21.243 3 20.001 3H4q-1.244 0-2.122.879Q1 4.757 1 6zm2 1.82V18q0 1 1 1h16q1 0 1-1V8.82l-7.439 4.727q-.716.449-1.56.449-.846 0-1.567-.452zm18-2.37-8.5 5.403q-.5.312-.994.003L3 6.451V6q0-1 1-1h16q1 0 1 1z",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default Information;