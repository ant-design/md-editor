import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Application(props: IconProps): React.ReactElement {
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
    id: "Application-master_svg0_1352_40512"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Application-master_svg0_1352_40512)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20.496 18.596 13.5 22.594q-.262.151-.524.25v-9.76L22 7.983v8.015q-.002 1.73-1.5 2.595zm.83-12.53-9.36 5.291-9.435-5.11q.363-.495.973-.847L10.5 1.402Q12 .536 13.496 1.4L20.5 5.402q.494.285.826.665M2 8.234v7.765q.002 1.731 1.5 2.596l7.004 4.002q.236.137.472.23v-9.73z"
  })));
}
export default Application;