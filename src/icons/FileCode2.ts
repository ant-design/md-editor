import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function FileCode2(props: IconProps): React.ReactElement {
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
    id: "FileCode2-master_svg0_1308_37661"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#FileCode2-master_svg0_1308_37661)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 8V4q0-1.243.879-2.121Q4.757 1 6 1h9a1 1 0 0 1 .707.293l5 5A1 1 0 0 1 21 7v13q0 1.243-.879 2.121Q19.243 23 18 23H4a1 1 0 1 1 0-2h14q1 0 1-1V9h-3q-1.243 0-2.121-.879Q13 7.243 13 6V3H6Q5 3 5 4v4a1 1 0 0 1-2 0m12-4.586V6q0 .414.293.707T16 7h2.586zm-9.293 9.293a1 1 0 1 0-1.414-1.414l-3 3a1 1 0 0 0 0 1.414l3 3a1 1 0 1 0 1.414-1.414L3.414 15zm7 1.586-3-3a1 1 0 0 0-1.414 1.414L10.586 15l-2.293 2.293a1 1 0 1 0 1.414 1.414l3-3a1 1 0 0 0 0-1.414",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default FileCode2;