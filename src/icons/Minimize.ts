import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Minimize(props: IconProps): React.ReactElement {
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
    id: "Minimize-master_svg0_999_25702"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Minimize-master_svg0_999_25702)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5.333 1.333A.667.667 0 0 0 4.667 2v2q0 .276-.196.471-.195.196-.471.196H2A.667.667 0 0 0 2 6h2q.828 0 1.414-.586T6 4V2a.667.667 0 0 0-.667-.667M4 10H2a.667.667 0 1 0 0 1.333h2q.276 0 .471.196.196.195.196.471v2A.667.667 0 0 0 6 14v-2q0-.828-.586-1.414T4 10m6.667-8.667A.667.667 0 0 0 10 2v2q0 .828.586 1.414T12 6h2a.667.667 0 0 0 0-1.333h-2q-.276 0-.471-.196-.196-.195-.196-.471V2a.667.667 0 0 0-.666-.667m3.333 10h-2q-.276 0-.471.196-.196.195-.196.471v2A.667.667 0 0 1 10 14v-2q0-.828.586-1.414T12 10h2a.667.667 0 1 1 0 1.333",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default Minimize;