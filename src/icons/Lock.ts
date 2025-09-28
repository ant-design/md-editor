import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Lock(props: IconProps): React.ReactElement {
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
    id: "Lock-master_svg0_2948_14234"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Lock-master_svg0_2948_14234)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M17,12L5,12Q4.585789999999999,12,4.29289,12.2929Q4,12.5858,4,13L4,20Q4,20.4142,4.29289,20.7071Q4.585789999999999,21,5,21L19,21Q19.4142,21,19.7071,20.7071Q20,20.4142,20,20L20,13Q20,12.5858,19.7071,12.2929Q19.4142,12,19,12L17,12ZM16,7L16,10L8,10L8,7Q8,5.34315,9.17157,4.17157Q10.34315,3,12,3Q13.6569,3,14.8284,4.17157Q16,5.34315,16,7ZM6,10L6,7Q6,4.5147200000000005,7.75736,2.7573600000000003Q9.51472,1,12,1Q14.4853,1,16.2426,2.7573600000000003Q18,4.5147200000000005,18,7L18,10L19,10Q20.2426,10,21.1213,10.87868Q22,11.7574,22,13L22,20Q22,21.2426,21.1213,22.1213Q20.2426,23,19,23L5,23Q3.7573600000000003,23,2.87868,22.1213Q2,21.2426,2,20L2,13Q2,11.7574,2.87868,10.87868Q3.7573600000000003,10,5,10L6,10Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default Lock;