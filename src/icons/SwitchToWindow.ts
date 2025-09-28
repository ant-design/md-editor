import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function SwitchToWindow(props: IconProps): React.ReactElement {
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
    id: "SwitchToWindow-master_svg0_2370_13476"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#SwitchToWindow-master_svg0_2370_13476)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M8,22C7.44772,22,7,22.447715,7,23L7,26.58579L2.70723,22.293013C2.51957,22.105357,2.2652200000000002,22,2,22C1.447715,22,1,22.447715,1,23C1,23.26522,1.105357,23.51957,1.292893,23.70711L5.58579,28L2,28C1.447715,28,1,28.44772,1,29C1,29.55228,1.447715,30,2,30L8,30C8.55228,30,9,29.55228,9,29L9,23C9,22.447715,8.55228,22,8,22ZM12,23L19,23Q20.2426,23,21.1213,23.87868Q22,24.75736,22,26L22,29C22,29.55228,21.5523,30,21,30C20.4477,30,20,29.55228,20,29L20,26Q20,25.58579,19.7071,25.29289Q19.4142,25,19,25L12,25C11.4477,25,11,24.55228,11,24C11,23.44771,11.4477,23,12,23ZM2,33C2,32.4477,2.44771,32,3,32C3.55228,32,4,32.4477,4,33L4,35Q4,35.4142,4.29289,35.7071Q4.585789999999999,36,5,36L8,36C8.55228,36,9,36.4477,9,37C9,37.5523,8.55228,38,8,38L5,38Q3.75736,38,2.87868,37.1213Q2,36.242599999999996,2,35L2,33ZM11,39L11,34Q11,33.1716,11.5858,32.5858Q12.1716,32,13,32L21,32Q21.8284,32,22.4142,32.5858Q23,33.1716,23,34L23,39Q23,39.8284,22.4142,40.4142Q21.8284,41,21,41L13,41Q12.1716,41,11.5858,40.4142Q11,39.8284,11,39ZM13,39L21,39L21,34L13,34L13,39Z",
    style: {
      mixBlendMode: "passthrough"
    },
    transform: "matrix(1 0 0 -1 0 44)"
  }))));
}
export default SwitchToWindow;