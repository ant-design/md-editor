import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function HeartHandshake(props: IconProps): React.ReactElement {
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
    id: "HeartHandshake-master_svg0_2967_14257"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#HeartHandshake-master_svg0_2967_14257)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M14.1722,10.10386C13.7723,9.7039,13.1239,9.7039,12.7241,10.10386L12,10.8279C11.2002,11.62761,9.90357,11.62761,9.10381,10.8279C8.30405,10.02808,8.30405,8.73143,9.10381,7.93167L14.8694,2.16459C17.0237,1.677238,19.3733,2.272177,21.0506,3.94942C23.5279,6.42674,23.6441,10.37111,21.3991,12.986L19.2404,15.1721L14.1722,10.10386ZM2.9494100000000003,3.94942C5.17487,1.723961,8.58423,1.403944,11.1501,2.989366L7.65571,6.48358C6.0562,8.0831,6.0562,10.67645,7.65571,12.276C9.20677,13.827,11.6923,13.874,13.2999,12.417L13.4481,12.276L17.7923,16.6202L13.4481,20.9646C12.6483,21.7643,11.3517,21.7643,10.55195,20.9646L2.9494100000000003,13.362C0.35019500000000003,10.76277,0.35019500000000003,6.54863,2.9494100000000003,3.94942Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default HeartHandshake;