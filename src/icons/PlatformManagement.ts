import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function PlatformManagement(props: IconProps): React.ReactElement {
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
    id: "PlatformManagement-master_svg0_1352_40653"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#PlatformManagement-master_svg0_1352_40653)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 5v14q0 1.243.879 2.121Q3.757 22 5 22h14q1.243 0 2.121-.879Q22 20.243 22 19V5q0-1.243-.879-2.121Q20.243 2 19 2H5q-1.243 0-2.121.879Q2 3.757 2 5m3-1a1 1 0 0 0-1 1v14a1 1 0 1 0 2 0V5a1 1 0 0 0-1-1m7 2a1 1 0 0 0-1 1v12a1 1 0 1 0 2 0V7a1 1 0 0 0-1-1m4.97.758 3 11.999A.998.998 0 0 1 19 20a1 1 0 0 1-.97-.758l-3-12a1 1 0 1 1 1.94-.485M8 7a1 1 0 0 0-1 1v11a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1"
  })));
}
export default PlatformManagement;