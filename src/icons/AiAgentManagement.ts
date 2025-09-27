import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function AiAgentManagement(props: IconProps): React.ReactElement {
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
    id: "AiAgentManagement-master_svg0_1063_41430"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#AiAgentManagement-master_svg0_1063_41430)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18.296 11.23c1.006 0 1.991-.303 2.834-.874q.129.803.13 1.644c0 5.523-4.312 10-9.63 10a9.3 9.3 0 0 1-4.535-1.176L2 22l1.132-5.291A10.26 10.26 0 0 1 2 12C2 6.477 6.311 2 11.63 2c.932 0 1.834.138 2.687.394a5.5 5.5 0 0 0-1.206 3.452c0 2.974 2.322 5.385 5.185 5.385m-4.444-5 1.217.468a4.16 4.16 0 0 1 2.407 2.5l.45 1.264.45-1.264a4.16 4.16 0 0 1 2.407-2.5L22 6.231l-1.217-.468a4.16 4.16 0 0 1-2.407-2.5L17.926 2l-.45 1.264a4.16 4.16 0 0 1-2.407 2.5zM6.815 12c0 2.761 2.155 5 4.815 5 2.659 0 4.814-2.239 4.814-5H14.52c0 1.657-1.294 3-2.89 3-1.595 0-2.888-1.343-2.888-3z"
  })));
}
export default AiAgentManagement;