import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Ts(props: IconProps): React.ReactElement {
  return /*#__PURE__*/React.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 48 48",
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
    id: "Ts-master_svg0_1_0240"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 48,
    height: 48,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Ts-master_svg0_1_0240)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M14.88 21.105a12 12 0 0 0-2.366 11.468l-1.907.603-5.615 1.774-1.907.603a21.89 21.89 0 0 1 5.27-21.95 21.89 21.89 0 0 1 32.86 1.886L30.39 18.86a12 12 0 0 0-2.79-1.303 11.97 11.97 0 0 0-12.693 3.57zm-6.433-4.607q-2.777 3.43-3.83 7.815t-.136 8.701l5.654-1.787q-.462-2.75.208-5.54t2.33-5.029zm27.82 3.673 6.675-2.077-5.137 4.74-2.502 2.31-5.412 4.996a6 6 0 1 1-3.854-6.784l7.014-2.183zm-.341 8.481 8.389-7.743a21.88 21.88 0 0 1 .495 14.71l-9.451-3.02c.419-1.312.6-2.643.567-3.947"
  })));
}
export default Ts;