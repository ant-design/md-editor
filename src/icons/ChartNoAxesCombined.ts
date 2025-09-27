import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function ChartNoAxesCombined(props: IconProps): React.ReactElement {
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
    id: "ChartNoAxesCombined-master_svg0_2994_23018"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#ChartNoAxesCombined-master_svg0_2994_23018)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M23,3C23,3.2652200000000002,22.8946,3.51957,22.7071,3.70711L14.062,12.3522Q13.6224,12.7929,13,12.7929Q12.3776,12.7929,11.9389,12.3531L9.00047,9.41469L2.7070499999999997,15.7072C2.51952,15.8947,2.26519,16,2,16C1.447715,16,1,15.5523,1,15C1,14.7348,1.105378,14.4804,1.292946,14.2928L7.93995,7.64684Q8.37931,7.20761,9.0005,7.20761Q9.62169,7.20761,10.061,7.64679L13,10.58579L21.292,2.293773C21.4804,2.105356,21.7348,2,22,2C22.5523,2,23,2.447715,23,3ZM20,9C19.4477,9,19,9.44772,19,10L19,21C19,21.5523,19.4477,22,20,22C20.5523,22,21,21.5523,21,21L21,10C21,9.44772,20.5523,9,20,9ZM8,13C7.44772,13,7,13.4477,7,14L7,21C7,21.5523,7.44772,22,8,22C8.55228,22,9,21.5523,9,21L9,14C9,13.4477,8.55228,13,8,13ZM15,14C15,13.4477,15.4477,13,16,13C16.552300000000002,13,17,13.4477,17,14L17,21C17,21.5523,16.552300000000002,22,16,22C15.4477,22,15,21.5523,15,21L15,14ZM11,16C11,15.4477,11.4477,15,12,15C12.5523,15,13,15.4477,13,16L13,21C13,21.5523,12.5523,22,12,22C11.4477,22,11,21.5523,11,21L11,16ZM4,17C3.44772,17,3,17.447699999999998,3,18L3,21C3,21.5523,3.44772,22,4,22C4.55228,22,5,21.5523,5,21L5,18C5,17.447699999999998,4.55228,17,4,17Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default ChartNoAxesCombined;