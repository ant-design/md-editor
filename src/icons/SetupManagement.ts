import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function SetupManagement(props: IconProps): React.ReactElement {
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
    id: "SetupManagement-master_svg0_2_0779"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#SetupManagement-master_svg0_2_0779)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M22 8.066c0-1.119-.6-2.153-1.575-2.712l-6.85-3.934a3.16 3.16 0 0 0-3.15 0l-6.85 3.934A3.13 3.13 0 0 0 2 8.066v7.868c0 1.119.6 2.153 1.575 2.712l6.85 3.934c.975.56 2.175.56 3.15 0l6.85-3.934A3.13 3.13 0 0 0 22 15.934zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8"
  })));
}
export default SetupManagement;