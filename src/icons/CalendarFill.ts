import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function CalendarFill(props: IconProps): React.ReactElement {
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
    id: "CalendarFill-master_svg0_2982_14684"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#CalendarFill-master_svg0_2982_14684)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M8,1C7.44772,1,7,1.447715,7,2L7,3L5,3Q3.7573600000000003,3,2.87868,3.87868Q2,4.75736,2,6L2,9L22,9L22,6Q22,4.75736,21.1213,3.87868Q20.2426,3,19,3L17,3L17,2C17,1.447715,16.552300000000002,1,16,1C15.4477,1,15,1.447715,15,2L15,3L9,3L9,2C9,1.447715,8.55228,1,8,1ZM22,11L2,11L2,20Q2,21.2426,2.87868,22.1213Q3.7573600000000003,23,5,23L19,23Q20.2426,23,21.1213,22.1213Q22,21.2426,22,20L22,11Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default CalendarFill;