import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function LaptopMinimal(props: IconProps): React.ReactElement {
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
    id: "LaptopMinimal-master_svg0_2432_15968"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#LaptopMinimal-master_svg0_2432_15968)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M22 19H2a1 1 0 1 0 0 2h20a1 1 0 1 0 0-2M2 6v8q0 1.243.879 2.121Q3.757 17 5 17h14q1.243 0 2.121-.879Q22 15.243 22 14V6q0-1.243-.879-2.121Q20.243 3 19 3H5q-1.243 0-2.121.879Q2 4.757 2 6m2.293 8.707Q4 14.414 4 14V6q0-.414.293-.707T5 5h14q.414 0 .707.293T20 6v8q0 .414-.293.707T19 15H5q-.414 0-.707-.293",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default LaptopMinimal;