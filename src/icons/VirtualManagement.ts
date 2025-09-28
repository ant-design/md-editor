import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function VirtualManagement(props: IconProps): React.ReactElement {
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
    id: "VirtualManagement-master_svg0_1036_32274"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#VirtualManagement-master_svg0_1036_32274)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 9.526H8.715c-.888 0-1.608.639-1.608 1.426V19h-.755C3.366 18.846 1 16.645 1 13.967c0-2.271 1.7-4.19 4.036-4.817-1.744-3.343.363-7.332 4.25-8.044 3.886-.711 7.43 2.243 7.146 5.957 1.786.1 3.445 1.154 4.568 2.463m.485 9.48H9V12.02C9 11.456 9.452 11 10.01 11H23v6.478c0 .844-.678 1.529-1.515 1.529M11 13h9.98v4H11zm.772 7.957h8.456V23h-8.456z",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default VirtualManagement;