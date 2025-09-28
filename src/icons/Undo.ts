import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Undo(props: IconProps): React.ReactElement {
  return /*#__PURE__*/React.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 16 16",
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
    id: "Undo-master_svg0_280_62591"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Undo-master_svg0_280_62591)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6.471 3.138a.667.667 0 1 0-.943-.942L2.195 5.528a.667.667 0 0 0 0 .943L5.53 9.805a.667.667 0 1 0 .942-.943L4.276 6.667h5.39q1.243 0 2.122.878.879.879.879 2.122t-.879 2.121-2.121.879H7.333a.667.667 0 1 0 0 1.333h2.334q1.795 0 3.064-1.27Q14 11.463 14 9.668t-1.27-3.064q-1.268-1.27-3.063-1.27h-5.39z",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default Undo;