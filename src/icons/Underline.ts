import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Underline(props: IconProps): React.ReactElement {
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
    id: "Underline-master_svg0_2432_16007"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Underline-master_svg0_2432_16007)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M20,19L4,19C3.447715,19,3,19.4477,3,20C3,20.5523,3.447715,21,4,21L20,21C20.5523,21,21,20.5523,21,20C21,19.4477,20.5523,19,20,19ZM6,3C5.44772,3,5,3.447715,5,4L5,10Q5,12.8995,7.05025,14.9497Q9.1005,17,12,17Q14.8995,17,16.9497,14.9497Q19,12.8995,19,10L19,4C19,3.447715,18.552300000000002,3,18,3C17.447699999999998,3,17,3.447715,17,4L17,10Q17,12.07107,15.5355,13.5355Q14.0711,15,12,15Q9.928930000000001,15,8.46447,13.5355Q7,12.07107,7,10L7,4C7,3.447715,6.55228,3,6,3Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default Underline;