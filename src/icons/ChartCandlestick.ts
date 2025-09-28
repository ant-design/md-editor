import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function ChartCandlestick(props: IconProps): React.ReactElement {
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
    id: "ChartCandlestick-master_svg0_2994_23001"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#ChartCandlestick-master_svg0_2994_23001)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M2,3C2,2.447715,2.447715,2,3,2C3.55228,2,4,2.447715,4,3L4,19Q4,20,5,20L21,20C21.5523,20,22,20.4477,22,21C22,21.5523,21.5523,22,21,22L5,22Q3.7573600000000003,22,2.87868,21.1213Q2,20.2426,2,19L2,3ZM16,3C16,2.447715,16.447699999999998,2,17,2C17.552300000000002,2,18,2.447715,18,3L18,4Q18.8284,4,19.4142,4.585789999999999Q20,5.17157,20,6L20,12Q20,12.8284,19.4142,13.4142Q18.8284,14,18,14L18,16C18,16.552300000000002,17.552300000000002,17,17,17C16.447699999999998,17,16,16.552300000000002,16,16L16,14Q15.1716,14,14.5858,13.4142Q14,12.8284,14,12L14,6Q14,5.17157,14.5858,4.585789999999999Q15.1716,4,16,4L16,3ZM17,12L18,12L18,6L16,6L16,12L17,12ZM9,4C8.44772,4,8,4.44772,8,5L8,8Q7.17157,8,6.58579,8.58579Q6,9.17157,6,10L6,14Q6,14.8284,6.58579,15.4142Q7.17157,16,8,16L8,17C8,17.552300000000002,8.44772,18,9,18C9.55228,18,10,17.552300000000002,10,17L10,16Q10.82843,16,11.41421,15.4142Q12,14.8284,12,14L12,10Q12,9.17157,11.41421,8.58579Q10.82843,8,10,8L10,5C10,4.44772,9.55228,4,9,4ZM9,14L10,14L10,10L8,10L8,14L9,14Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default ChartCandlestick;