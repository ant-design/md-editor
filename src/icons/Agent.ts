import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Agent(props: IconProps): React.ReactElement {
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
    id: "Agent-master_svg0_1303_37549"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Agent-master_svg0_1303_37549)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m1.307 16.224 7.54-12.648A2.21 2.21 0 0 1 10.75 2.5h2.5c.781 0 1.505.41 1.902 1.076l7.54 12.648c.406.68.41 1.525.012 2.209l-1.15 1.972a2.21 2.21 0 0 1-1.913 1.095H4.359c-.79 0-1.519-.417-1.914-1.095l-1.149-1.972a2.17 2.17 0 0 1 .011-2.209M12 8.429l2.353-2.702H9.647zm0 5.152 2.353-2.702H9.647zm-6.25 1.55-1.788 2.998h16.076l-1.787-2.999z"
  })));
}
export default Agent;