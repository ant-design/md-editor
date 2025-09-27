import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function CardSim(props: IconProps): React.ReactElement {
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
    id: "CardSim-master_svg0_2994_23033"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#CardSim-master_svg0_2994_23033)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M14.172,1L6,1Q4.75736,1,3.87868,1.8786800000000001Q3,2.7573600000000003,3,4L3,20Q3,21.2426,3.87868,22.1213Q4.75736,23,6,23L18,23Q19.2426,23,20.1213,22.1213Q21,21.2426,21,20L21,7.828Q21,6.5859,20.1211,5.70689L16.2932,1.8789989999999999Q15.4147,1.000265598,14.172,1ZM5,4Q5,3,6,3L14.172,3Q14.586,3.00009,14.8788,3.293L18.706899999999997,7.12111Q19,7.41425,19,7.828L19,20Q19,21,18,21L6,21Q5,21,5,20L5,4ZM7,11L7,17Q7,17.8284,7.58579,18.4142Q8.17157,19,9,19L15,19Q15.8284,19,16.4142,18.4142Q17,17.8284,17,17L17,11Q17,10.17157,16.4142,9.58579Q15.8284,9,15,9L9,9Q8.17157,9,7.58579,9.58579Q7,10.17157,7,11ZM9,13L15,13L15,11L9,11L9,13ZM9,17L9,15L11,15L11,17L9,17ZM15,17L13,17L13,15L15,15L15,17Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default CardSim;