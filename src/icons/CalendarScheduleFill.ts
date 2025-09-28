import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function CalendarScheduleFill(props: IconProps): React.ReactElement {
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
    id: "CalendarScheduleFill-master_svg0_2982_14246"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#CalendarScheduleFill-master_svg0_2982_14246)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M19,3L17,3L17,1L15,1L15,3L9,3L9,1L7,1L7,3L5,3C3.34315,3,2,4.31315,2,5.97C2,9.99,2,14.01,2,18.03C2,19.6869,3.36348,21,5.02034,21C6.93176,21,8.84318,21,10.7546,21C9.65672,19.6304,9,17.8919,9,16C9,11.5817,12.5817,8,17,8C18.8919,8,20.6304,8.65672,22,9.75463C22,8.49939,22,7.24416,22,5.98892C22,4.33207,20.6569,3,19,3M23,16C23,19.3137,20.3137,22,17,22C13.6863,22,11,19.3137,11,16C11,12.6863,13.6863,10,17,10C20.3137,10,23,12.6863,23,16ZM16,12L16,16.4142L18.2929,18.7071L19.7071,17.2929L18,15.5858L18,12L16,12Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default CalendarScheduleFill;