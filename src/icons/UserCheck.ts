import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function UserCheck(props: IconProps): React.ReactElement {
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
    id: "UserCheck-master_svg0_961_25729"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#UserCheck-master_svg0_961_25729)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9.333 4.667a3.333 3.333 0 1 1-6.666 0 3.333 3.333 0 0 1 6.666 0M8 4.667a2 2 0 1 0-4 0 2 2 0 0 0 4 0m7.138 1.804a.667.667 0 1 0-.943-.942L12 7.724l-.862-.862a.667.667 0 1 0-.943.943l1.334 1.333a.667.667 0 0 0 .942 0zM1.643 10.31q-.976.976-.976 2.357V14A.667.667 0 0 0 2 14v-1.333q0-.829.586-1.415.586-.585 1.414-.585h4q.828 0 1.414.585.586.586.586 1.415V14a.667.667 0 0 0 1.333 0v-1.333q0-1.381-.976-2.357T8 9.333H4q-1.38 0-2.357.977",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default UserCheck;