import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function MonitoringManagement(props: IconProps): React.ReactElement {
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
    id: "MonitoringManagement-master_svg0_87_1019"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 48,
    height: 48,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#MonitoringManagement-master_svg0_87_1019)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 20c0-8.837 7.163-16 16-16s16 7.163 16 16-7.163 16-16 16S8 28.837 8 20m7 0a9 9 0 1 1 18 0 9 9 0 0 1-18 0m9 6a6 6 0 1 0 0-12 6 6 0 0 0 0 12M8.724 42.553l3.73-7.462A18.9 18.9 0 0 0 24 39c4.343 0 8.345-1.457 11.546-3.91l3.73 7.463A1 1 0 0 1 38.382 44H9.618a1 1 0 0 1-.894-1.447",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default MonitoringManagement;