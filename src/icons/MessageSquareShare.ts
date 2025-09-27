import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function MessageSquareShare(props: IconProps): React.ReactElement {
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
    id: "MessageSquareShare-master_svg0_2413_13480"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#MessageSquareShare-master_svg0_2413_13480)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M5,4L12,4C12.5523,4,13,3.55228,13,3C13,2.447715,12.5523,2,12,2L5,2Q3.7573600000000003,2,2.878679,2.87868Q2,3.7573600000000003,2,5L2,21C2,21.5523,2.447715,22,3,22C3.2652200000000002,22,3.51957,21.8946,3.70711,21.7071L7.41421,18L19,18Q20.2426,18,21.1213,17.121299999999998Q22,16.2426,22,15L22,12C22,11.44771,21.5523,11,21,11C20.4477,11,20,11.44771,20,12L20,15Q20,16,19,16L7,16C6.73478,16,6.48043,16.1054,6.29289,16.2929L4,18.5858L4,5Q4,4,5,4ZM21,2L16,2C15.4477,2,15,2.447715,15,3C15,3.55228,15.4477,4,16,4L18.5858,4L15.2929,7.29289C15.1054,7.48043,15,7.73478,15,8C15,8.55228,15.4477,9,16,9C16.2652,9,16.5196,8.894639999999999,16.7074,8.70679L20,5.414210000000001L20,8C20,8.55228,20.4477,9,21,9C21.5523,9,22,8.55228,22,8L22,3C22,2.447715,21.5523,2,21,2Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default MessageSquareShare;