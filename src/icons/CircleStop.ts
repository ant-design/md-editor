import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function CircleStop(props: IconProps): React.ReactElement {
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
    id: "CircleStop-master_svg0_2559_13813"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#CircleStop-master_svg0_2559_13813)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M23,12C23,18.0751,18.0751,23,12,23C5.92487,23,1,18.0751,1,12C1,5.92487,5.92487,1,12,1C18.0751,1,23,5.92487,23,12ZM21,12C21,7.02944,16.970599999999997,3,12,3C7.02944,3,3,7.02944,3,12C3,16.970599999999997,7.02944,21,12,21C16.970599999999997,21,21,16.970599999999997,21,12ZM8.58579,15.4142Q8,14.8284,8,14L8,10Q8,9.17157,8.58579,8.58579Q9.17157,8,10,8L14,8Q14.8284,8,15.4142,8.58579Q16,9.17157,16,10L16,14Q16,14.8284,15.4142,15.4142Q14.8284,16,14,16L10,16Q9.17157,16,8.58579,15.4142ZM10,14L14,14L14,10L10,10L10,14Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default CircleStop;