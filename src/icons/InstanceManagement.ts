import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function InstanceManagement(props: IconProps): React.ReactElement {
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
    id: "InstanceManagement-master_svg0_1352_40712"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#InstanceManagement-master_svg0_1352_40712)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12.9 1.5H6.457c-.668 0-1.3.305-1.718.83L1.88 5.92H12.9zM1 8.132V20.29c0 1.22.985 2.21 2.2 2.21h17.6c1.215 0 2.2-.99 2.2-2.21V8.132zm21.12-2.21-2.86-3.592a2.2 2.2 0 0 0-1.717-.83H12.9v4.421zM4.3 11.657h14.4v2.21H4.3zm0 5.316H12v2.21H4.3z"
  })));
}
export default InstanceManagement;