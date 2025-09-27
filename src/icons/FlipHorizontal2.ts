import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function FlipHorizontal2(props: IconProps): React.ReactElement {
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
    id: "FlipHorizontal2-master_svg0_2529_13723"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#FlipHorizontal2-master_svg0_2529_13723)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M2,17L2,7C2,6.44772,2.447715,6,3,6C3.2652200000000002,6,3.51957,6.10536,3.70711,6.29289L8.70711,11.2929C8.894639999999999,11.4804,9,11.7348,9,12C9,12.2652,8.894639999999999,12.5196,8.70711,12.7071L3.70711,17.7071C3.31658,18.0976,2.683417,18.0976,2.292893,17.7071C2.105357,17.5196,2,17.2652,2,17ZM6.58579,12L4,14.5858L4,9.41421L6.58579,12ZM22,17C22,17.2652,21.8946,17.5196,21.7071,17.7071C21.3166,18.0976,20.6834,18.0976,20.2929,17.7071L15.2929,12.7071C14.9024,12.3166,14.9024,11.6834,15.2929,11.2929L20.2929,6.29289C20.4804,6.10536,20.7348,6,21,6C21.5523,6,22,6.44772,22,7L22,17ZM20,9.41421L20,14.5858L17.4142,12L20,9.41421ZM11,20C11,19.4477,11.44771,19,12,19C12.5523,19,13,19.4477,13,20L13,22C13,22.5523,12.5523,23,12,23C11.44771,23,11,22.5523,11,22L11,20ZM11,14C11,13.4477,11.44771,13,12,13C12.5523,13,13,13.4477,13,14L13,16C13,16.552300000000002,12.5523,17,12,17C11.44771,17,11,16.552300000000002,11,16L11,14ZM11,8C11,7.44772,11.44771,7,12,7C12.5523,7,13,7.44772,13,8L13,10C13,10.55228,12.5523,11,12,11C11.44771,11,11,10.55228,11,10L11,8ZM11,2C11,1.447715,11.44771,1,12,1C12.5523,1,13,1.447715,13,2L13,4C13,4.55228,12.5523,5,12,5C11.44771,5,11,4.55228,11,4L11,2Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default FlipHorizontal2;