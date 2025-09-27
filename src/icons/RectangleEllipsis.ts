import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function RectangleEllipsis(props: IconProps): React.ReactElement {
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
    id: "RectangleEllipsis-master_svg0_1231_36587"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#RectangleEllipsis-master_svg0_1231_36587)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 16V8q0-1.243.879-2.121Q2.757 5 4 5h16q1.243 0 2.121.879Q23 6.757 23 8v8q0 1.243-.879 2.121Q21.243 19 20 19H4q-1.243 0-2.121-.879Q1 17.243 1 16m2 0q0 .414.293.707T4 17h16q.414 0 .707-.293T21 16V8q0-.414-.293-.707T20 7H4q-.414 0-.707.293T3 8zm4-3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2"
  })));
}
export default RectangleEllipsis;