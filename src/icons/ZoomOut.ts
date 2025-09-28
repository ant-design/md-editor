import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function ZoomOut(props: IconProps): React.ReactElement {
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
    id: "ZoomOut-master_svg0_2529_13760"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#ZoomOut-master_svg0_2529_13760)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M16.6177,18.0319C15.078,19.2635,13.125,20,11,20C6.02944,20,2,15.9706,2,11C2,6.02944,6.02944,2,11,2C15.9706,2,20,6.02944,20,11C20,13.125,19.2635,15.078,18.0319,16.6177L21.7071,20.2929C22.0976,20.6834,22.0976,21.3166,21.7071,21.7071C21.3166,22.0976,20.6834,22.0976,20.2929,21.7071L16.6177,18.0319ZM15.8563,16.0415C14.5976,17.2542,12.8859,18,11,18C7.13401,18,4,14.866,4,11C4,7.13401,7.13401,4,11,4C14.866,4,18,7.13401,18,11C18,12.8859,17.2542,14.5976,16.0415,15.8563C16.007199999999997,15.8826,15.9743,15.9115,15.9429,15.9429C15.9115,15.9742,15.8827,16.007199999999997,15.8563,16.0415ZM8,10L14,10C14.5523,10,15,10.44772,15,11C15,11.55228,14.5523,12,14,12L8,12C7.44772,12,7,11.55228,7,11C7,10.44772,7.44772,10,8,10Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default ZoomOut;