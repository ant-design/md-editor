import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function ChartColumnStacked(props: IconProps): React.ReactElement {
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
    id: "ChartColumnStacked-master_svg0_2994_23871"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#ChartColumnStacked-master_svg0_2994_23871)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M3,2C2.447715,2,2,2.447715,2,3L2,19Q2,20.2426,2.87868,21.1213Q3.7573600000000003,22,5,22L21,22C21.5523,22,22,21.5523,22,21C22,20.4477,21.5523,20,21,20L5,20Q4,20,4,19L4,3C4,2.447715,3.55228,2,3,2ZM14,6L14,16Q14,16.828400000000002,14.5858,17.4142Q15.1716,18,16,18L18,18Q18.8284,18,19.4142,17.4142Q20,16.828400000000002,20,16L20,6Q20,5.17157,19.4142,4.585789999999999Q18.8284,4,18,4L16,4Q15.1716,4,14.5858,4.585789999999999Q14,5.17157,14,6ZM16,8L18,8L18,6L16,6L16,8ZM6,13L6,16Q6,16.828400000000002,6.58579,17.4142Q7.17157,18,8,18L10,18Q10.82843,18,11.41421,17.4142Q12,16.828400000000002,12,16L12,9Q12,8.17157,11.41421,7.58579Q10.82843,7,10,7L8,7Q7.17157,7,6.58579,7.58579Q6,8.17157,6,9L6,13ZM8,14L8,16L10,16L10,14L8,14ZM10,12L8,12L8,9L10,9L10,12ZM18,16L16,16L16,10L18,10L18,16Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default ChartColumnStacked;