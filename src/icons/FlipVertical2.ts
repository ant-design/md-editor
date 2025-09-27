import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function FlipVertical2(props: IconProps): React.ReactElement {
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
    id: "FlipVertical2-master_svg0_2529_13732"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#FlipVertical2-master_svg0_2529_13732)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M7,2L17,2C17.5523,2,18,2.447715,18,3C18,3.2652200000000002,17.8946,3.51957,17.7071,3.70711L12.7071,8.70711C12.5196,8.894639999999999,12.2652,9,12,9C11.7348,9,11.4804,8.894639999999999,11.2929,8.70711L6.29289,3.70711C5.90237,3.31658,5.90237,2.683417,6.29289,2.292893C6.48043,2.105357,6.73478,2,7,2ZM12,6.58579L9.41421,4L14.5858,4L12,6.58579ZM7,22C6.73478,22,6.48043,21.8946,6.29289,21.7071C5.90237,21.3166,5.90237,20.6834,6.29289,20.2929L11.2929,15.2929C11.6834,14.9024,12.3166,14.9024,12.7071,15.2929L17.7071,20.2929C17.8946,20.4804,18,20.7348,18,21C18,21.5523,17.5523,22,17,22L7,22ZM14.5858,20L9.41421,20L12,17.4142L14.5858,20ZM4,13L2,13C1.447716,13,1,12.5523,1,12C1,11.44771,1.447716,11,2,11L4,11C4.55228,11,5,11.44771,5,12C5,12.5523,4.55228,13,4,13ZM10,13L8,13C7.44771,13,7,12.5523,7,12C7,11.44771,7.44771,11,8,11L10,11C10.55228,11,11,11.44771,11,12C11,12.5523,10.55228,13,10,13ZM16,13L14,13C13.4477,13,13,12.5523,13,12C13,11.44771,13.4477,11,14,11L16,11C16.552300000000002,11,17,11.44771,17,12C17,12.5523,16.552300000000002,13,16,13ZM22,13L20,13C19.4477,13,19,12.5523,19,12C19,11.44771,19.4477,11,20,11L22,11C22.5523,11,23,11.44771,23,12C23,12.5523,22.5523,13,22,13Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default FlipVertical2;