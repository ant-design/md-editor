import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function OdpsColored(props: IconProps): React.ReactElement {
  return /*#__PURE__*/React.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 48 48"
  }, props, {
    style: Object.assign({
      verticalAlign: '-0.125em'
    }, props.style),
    className: ['sofa-icons-icon', props.className].filter(Boolean).join(' '),
    width: "1em",
    height: "1em"
  }), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
    id: "OdpsColored-master_svg0_1257_44221"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 48,
    height: 48,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#OdpsColored-master_svg0_1257_44221)"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#5732CD",
    d: "M26.5 4a5 5 0 0 1 4.221 7.683l7.11 9.955c3.208-.771 6.27 1.721 6.167 5.019-.104 3.297-3.317 5.592-6.47 4.621s-4.518-4.676-2.748-7.46l-7.11-9.955a5 5 0 0 1-.321.066l-4 18.392a6.25 6.25 0 1 1-7.775 1.282L9.779 23.94c-3.26.513-6.113-2.215-5.747-5.494s3.752-5.31 6.817-4.09 4.13 5.02 2.145 7.655l5.797 9.661q.442-.106.894-.146l3.999-18.394A5 5 0 0 1 26.5 4",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default OdpsColored;