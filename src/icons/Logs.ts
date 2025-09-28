import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Logs(props: IconProps): React.ReactElement {
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
    id: "Logs-master_svg0_232_39266"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Logs-master_svg0_232_39266)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 1a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2zM3 4v17a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-1v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V2H5a2 2 0 0 0-2 2m3 8v-2h6v2zm6 4v-2H6v2zm6 2v2H6v-2z",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default Logs;