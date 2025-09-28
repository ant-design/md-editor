import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function BookOpen(props: IconProps): React.ReactElement {
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
    id: "BookOpen-master_svg0_366_15705"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#BookOpen-master_svg0_366_15705)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M.667 2v10c0 .368.298.667.666.667H6q.552 0 .943.39t.39.943a.667.667 0 1 0 1.334 0q0-.552.39-.943t.943-.39h4.667a.667.667 0 0 0 .666-.667V2a.667.667 0 0 0-.666-.667h-4q-1.381 0-2.357.977-.17.17-.31.35-.14-.18-.31-.35-.976-.977-2.357-.977h-4A.667.667 0 0 0 .667 2m8 2.667v7.016q.594-.35 1.333-.35h4V2.667h-3.333q-.829 0-1.414.585-.586.586-.586 1.415m-1.334 0q0-.829-.585-1.415-.586-.585-1.415-.585H2v8.666h4q.74 0 1.333.35z"
  })));
}
export default BookOpen;