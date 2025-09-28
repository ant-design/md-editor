import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Kafka(props: IconProps): React.ReactElement {
  return /*#__PURE__*/React.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 48 48",
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
    id: "Kafka-master_svg0_1_0224"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 48,
    height: 48,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Kafka-master_svg0_1_0224)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M44 24c0 11.046-8.954 20-20 20a20 20 0 0 1-10.96-3.27q.474-.344.91-.78 1.07-1.071 1.582-2.374A16 16 0 0 0 24 40c8.837 0 16-7.163 16-16S32.837 8 24 8a16 16 0 0 0-8.468 2.424q-.511-1.303-1.582-2.374-.436-.436-.91-.78A20 20 0 0 1 24 4c11.046 0 20 8.954 20 20M13 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0m17.455 2.918a4 4 0 0 1-4.774 4.441c-1.15-.237-2.454-.409-3.424.255-.966.661-1.319 1.893-1.265 3.063a7 7 0 0 1-.037 1.115c-.13 1.144.237 2.393 1.237 2.962.883.502 1.987.277 2.94-.072a3.998 3.998 0 0 1 5.348 4.222 4 4 0 0 1-7.51 1.403c-.573-1.083-1.124-2.3-2.19-2.905-1.255-.713-2.807-.46-4.145.083A7 7 0 0 1 7 24a7 7 0 0 1 10.085-6.283c1.277.627 2.84.858 4.014.055.869-.595 1.267-1.67 1.618-2.662a4 4 0 0 1 7.738.808M4.018 23.156l.008 1.868a20 20 0 0 1-.008-1.868M13 35a4 4 0 1 1-8 0 4 4 0 0 1 8 0"
  })));
}
export default Kafka;