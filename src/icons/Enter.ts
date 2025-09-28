import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Enter(props: IconProps): React.ReactElement {
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
    id: "Enter-master_svg0_245_40353"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "Enter-master_svg1_22_11520",
    x1: 0.701,
    x2: -0.196,
    y1: 0.757,
    y2: 0.176
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#263447"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#101413",
    stopOpacity: 0.34
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Enter-master_svg0_245_40353)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2.5 3a1.5 1.5 0 0 0 0 3h10a1.5 1.5 0 0 0 0-3zm14.52 1.857 5.21 2.986.501-.862a1.98 1.98 0 0 0-.734-2.719l-1.737-.995a2.014 2.014 0 0 0-2.74.728zM10 16.922 11.101 21l4.11-1.093 6.016-10.34-5.21-2.986zM2.5 8a1.5 1.5 0 1 0 0 3h7a1.5 1.5 0 1 0 0-3zm0 5a1.5 1.5 0 0 0 0 3h4a1.5 1.5 0 0 0 0-3zm0 5a1.5 1.5 0 0 0 0 3h2a1.5 1.5 0 0 0 0-3z"
  })));
}
export default Enter;