import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function RotateCcw(props: IconProps): React.ReactElement {
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
    id: "RotateCcw-master_svg0_2790_14357"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#RotateCcw-master_svg0_2790_14357)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M3,2C2.447715,2,2,2.447715,2,3L2,8C2,8.55228,2.447715,9,3,9L8,9C8.55228,9,9,8.55228,9,8C9,7.44772,8.55228,7,8,7L5.414210000000001,7L5.96711,6.44711Q8.484960000000001,4.01323,12.0038,3.99999Q15.3137,4,17.6569,6.34315Q20,8.68629,20,12Q20,15.3137,17.6569,17.6569Q15.3137,20,12,20Q8.68629,20,6.34315,17.6569Q4,15.3137,4,12C4,11.44771,3.55228,11,3,11C2.447715,11,2,11.44771,2,12L2,12.0011Q2.000405073,16.1425,4.928929999999999,19.0711Q7.85786,22,12,22Q16.1421,22,19.0711,19.0711Q22,16.1421,22,12Q22,7.85787,19.0711,4.928929999999999Q16.1421,2,11.99624,2.00000703335Q7.67314,2.0162703,4.55289,5.03289L4,5.585789999999999L4,3C4,2.447715,3.55228,2,3,2Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default RotateCcw;