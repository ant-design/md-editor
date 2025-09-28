import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function CornerDownRight(props: IconProps): React.ReactElement {
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
    id: "CornerDownRight-master_svg0_2328_13373"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#CornerDownRight-master_svg0_2328_13373)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M3,4C3,3.447715,3.447715,3,4,3C4.55228,3,5,3.447715,5,4L5,11Q5,12.24264,5.87868,13.1213Q6.75736,14,8,14L17.5858,14L14.2929,10.70711C14.1054,10.51957,14,10.26522,14,10C14,9.44772,14.4477,9,15,9C15.2652,9,15.5196,9.105360000000001,15.7071,9.29289L20.7071,14.2929C20.8881,14.4739,21,14.7239,21,15C21,15.2761,20.8881,15.5261,20.7071,15.7071L15.7071,20.7071C15.5196,20.8946,15.2652,21,15,21C14.4477,21,14,20.5523,14,20C14,19.7348,14.1054,19.4804,14.2932,19.2926L17.5858,16L8,16Q5.928929999999999,16,4.46447,14.5355Q3,13.0711,3,11L3,4Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default CornerDownRight;