import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function TramFront(props: IconProps): React.ReactElement {
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
    id: "TramFront-master_svg0_2879_14296"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#TramFront-master_svg0_2879_14296)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M3,11L3,5Q3,3.7573600000000003,3.87868,2.87868Q4.75736,2,6,2L18,2Q19.2426,2,20.1213,2.87868Q21,3.7573600000000003,21,5L21,17Q21,18.2426,20.1213,19.1213Q19.2426,20,18,20L17.868499999999997,20L18.832,21.4452C18.9416,21.6096,19,21.8026,19,22C19,22.5523,18.552300000000002,23,18,23C17.665599999999998,23,17.3534,22.8329,17.1679,22.5547L15.4648,20L8.53518,20L6.83211,22.5546C6.64658,22.8329,6.334350000000001,23,6,23C5.44772,23,5,22.5523,5,22C5,21.8026,5.05844,21.6096,5.167949999999999,21.4453L6.13148,20L6,20Q4.75736,20,3.87868,19.1213Q3,18.2426,3,17L3,11ZM5,12L5,17Q5,18,6,18L18,18Q19,18,19,17L19,12L5,12ZM19,10L19,5Q19,4,18,4L13,4L13,10L19,10ZM11,4L11,10L5,10L5,5Q5,4,6,4L11,4ZM9,15C9,15.5523,8.55228,16,8,16C7.44772,16,7,15.5523,7,15C7,14.4477,7.44772,14,8,14C8.55228,14,9,14.4477,9,15ZM17,15C17,15.5523,16.552300000000002,16,16,16C15.4477,16,15,15.5523,15,15C15,14.4477,15.4477,14,16,14C16.552300000000002,14,17,14.4477,17,15Z"
  }))));
}
export default TramFront;