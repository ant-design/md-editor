import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Memory(props: IconProps): React.ReactElement {
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
    id: "Memory-master_svg0_691_14088"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Memory-master_svg0_691_14088)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1.333 5.333c0-.176.07-.346.196-.471l3.333-3.333a.67.67 0 0 1 .471-.196h7.334q.828 0 1.414.586t.586 1.414v9.334q0 .828-.586 1.414t-1.414.586H3.333q-.828 0-1.414-.586t-.586-1.414zm1.334.276L5.61 2.667h7.057q.276 0 .471.195t.195.471v9.334q0 .276-.195.471t-.471.195H3.333q-.276 0-.471-.195t-.195-.471zm4 1.724V4.667a.667.667 0 1 0-1.333 0v2.666a.667.667 0 0 0 1.333 0m2.667 0V4.667a.667.667 0 0 0-1.333 0v2.666a.667.667 0 0 0 1.333 0m2.667 0V4.667a.667.667 0 0 0-1.334 0v2.666a.667.667 0 0 0 1.334 0"
  })));
}
export default Memory;