import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function OperationsManagement(props: IconProps): React.ReactElement {
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
    id: "OperationsManagement-master_svg0_1036_33916"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#OperationsManagement-master_svg0_1036_33916)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18.13 1.714c-2.191-.562-4.627-.018-6.347 1.631-1.98 1.9-2.432 4.709-1.356 7.023L5.4 15.19a3.93 3.93 0 0 0-3.277 1.036 3.57 3.57 0 0 0 0 5.198c1.496 1.435 3.923 1.435 5.42 0a3.57 3.57 0 0 0 1.043-3.35l4.858-4.659c2.469 1.208 5.566.821 7.632-1.16 1.72-1.648 2.286-3.984 1.701-6.086l-2.863 2.745-3.485-1.113-1.161-3.342zM5.608 19.567c-.428.41-1.12.41-1.549 0a1.02 1.02 0 0 1 0-1.485 1.13 1.13 0 0 1 1.55 0 1.02 1.02 0 0 1 0 1.485",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default OperationsManagement;