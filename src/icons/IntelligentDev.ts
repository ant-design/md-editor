import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function IntelligentDev(props: IconProps): React.ReactElement {
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
    id: "IntelligentDev-master_svg0_1_0569"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 48,
    height: 48,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#IntelligentDev-master_svg0_1_0569)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 31.214V20h4v-4H9v-.5h.002v-2.715a2 2 0 0 1 1.17-1.82l4.83-2.2v4l9.623-4.387a2 2 0 0 1 1.659 0l9.627 4.388v-4l4.828 2.2a2 2 0 0 1 1.17 1.82V22h-6a1 1 0 0 0-.583-.907l-9.457-4.31a1 1 0 0 0-.83 0l-9.454 4.31a1 1 0 0 0-.585.91v5.995a1 1 0 0 0 .585.91l9.455 4.31a1 1 0 0 0 .83 0l9.456-4.311a1 1 0 0 0 .583-.907h6v3.214a2 2 0 0 1-1.17 1.82l-14.455 6.588a2 2 0 0 1-1.659 0l-14.454-6.589A2 2 0 0 1 9 31.213M5 16h4v4H5zm0 0H2v-3h3zm32.29-.494h3v3h-3zM18.982 26.539v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1m8.92 0v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1"
  })));
}
export default IntelligentDev;