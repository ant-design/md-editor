import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function ChevronsDownUp(props: IconProps): React.ReactElement {
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
    id: "ChevronsDownUp-master_svg0_2413_13453"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#ChevronsDownUp-master_svg0_2413_13453)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M16.2929,20.7071L12,16.4142L7.70742,20.7068C7.51957,20.8946,7.26522,21,7,21C6.447715,21,6,20.5523,6,20C6,19.7348,6.105357,19.4804,6.292893,19.2929L11.29289,14.2929C11.68342,13.9024,12.31658,13.9024,12.70711,14.2929L17.7071,19.2929C17.8946,19.4804,18,19.7348,18,20C18,20.5523,17.552300000000002,21,17,21C16.7348,21,16.4804,20.8946,16.2929,20.7071ZM6,4C6,4.26522,6.105357,4.51957,6.292893,4.70711L11.29289,9.70711C11.48043,9.894639999999999,11.73478,10,12,10C12.26522,10,12.51957,9.894639999999999,12.70711,9.70711L17.7068,4.70742C17.8946,4.51957,18,4.26522,18,4C18,3.447715,17.552300000000002,3,17,3C16.7348,3,16.4804,3.105357,16.2929,3.292893L12,7.58579L7.70711,3.292893C7.51957,3.105357,7.26522,3,7,3C6.447715,3,6,3.447715,6,4Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default ChevronsDownUp;