import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function CloudEdgeCollaborationManagement(props: IconProps): React.ReactElement {
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
    id: "CloudEdgeCollaborationManagement-master_svg0_1036_32516"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#CloudEdgeCollaborationManagement-master_svg0_1036_32516)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 8.01C4 10.206 5.85 12 8.118 12H9.5l1.5-.001V14H4.5v4H2a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1H6.5v-2h11v2H15a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.5v-4H13v-2h3.09c2.162-.004 3.911-1.696 3.91-3.781 0-1.828-1.351-3.35-3.156-3.71-.507-2.055-2.41-3.506-4.6-3.509-1.989 0-3.762 1.21-4.425 3.019a4.2 4.2 0 0 0-2.395.971A3.96 3.96 0 0 0 4 8.01"
  })));
}
export default CloudEdgeCollaborationManagement;