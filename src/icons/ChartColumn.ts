import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function ChartColumn(props: IconProps): React.ReactElement {
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
    id: "ChartColumn-master_svg0_2994_23011"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#ChartColumn-master_svg0_2994_23011)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M3,2C2.447715,2,2,2.447715,2,3L2,19Q2,20.2426,2.87868,21.1213Q3.7573600000000003,22,5,22L21,22C21.5523,22,22,21.5523,22,21C22,20.4477,21.5523,20,21,20L5,20Q4,20,4,19L4,3C4,2.447715,3.55228,2,3,2ZM13,4C12.4477,4,12,4.44771,12,5L12,17C12,17.552300000000002,12.4477,18,13,18C13.5523,18,14,17.552300000000002,14,17L14,5C14,4.44771,13.5523,4,13,4ZM17,9C17,8.44772,17.447699999999998,8,18,8C18.5523,8,19,8.44772,19,9L19,17C19,17.552300000000002,18.5523,18,18,18C17.447699999999998,18,17,17.552300000000002,17,17L17,9ZM8,13C7.44772,13,7,13.4477,7,14L7,17C7,17.552300000000002,7.44772,18,8,18C8.55228,18,9,17.552300000000002,9,17L9,14C9,13.4477,8.55228,13,8,13Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default ChartColumn;