import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function AudioLines(props: IconProps): React.ReactElement {
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
    id: "AudioLines-master_svg0_2173_85316"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#AudioLines-master_svg0_2173_85316)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 10a1 1 0 0 1 2 0v3a1 1 0 1 1-2 0zm4-4a1 1 0 1 1 2 0v11a1 1 0 1 1-2 0zm4-3a1 1 0 1 1 2 0v18a1 1 0 1 1-2 0zm4 5a1 1 0 1 1 2 0v7a1 1 0 1 1-2 0zm4-3a1 1 0 1 1 2 0v13a1 1 0 1 1-2 0zm4 5a1 1 0 1 1 2 0v3a1 1 0 1 1-2 0z",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default AudioLines;