import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function ChevronsLeftRightEllipsis(props: IconProps): React.ReactElement {
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
    id: "ChevronsLeftRightEllipsis-master_svg0_1170_32075"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#ChevronsLeftRightEllipsis-master_svg0_1170_32075)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6.707 8.707a1 1 0 0 0-1.414-1.414l-4 4a1 1 0 0 0 0 1.414l4 4a1 1 0 1 0 1.414-1.415L3.414 12zm12-1.414 4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 1 1-1.414-1.414L20.586 12l-3.293-3.293a1 1 0 0 1 1.414-1.414M8 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2m4 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m4 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2"
  })));
}
export default ChevronsLeftRightEllipsis;