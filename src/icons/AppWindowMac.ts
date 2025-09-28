import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function AppWindowMac(props: IconProps): React.ReactElement {
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
    id: "AppWindowMac-master_svg0_1352_39967"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#AppWindowMac-master_svg0_1352_39967)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 18V6q0-1.243.879-2.121Q2.757 3 4 3h16q1.243 0 2.121.879Q23 4.757 23 6v12q0 1.243-.879 2.121Q21.243 21 20 21H4q-1.243 0-2.121-.879Q1 19.243 1 18m2 0q0 1 1 1h16q1 0 1-1V6q0-1-1-1H4Q3 5 3 6zm3-9a1 1 0 1 0 0-2 1 1 0 0 0 0 2m4 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m4 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2"
  })));
}
export default AppWindowMac;