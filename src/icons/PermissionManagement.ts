import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function PermissionManagement(props: IconProps): React.ReactElement {
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
    id: "PermissionManagement-master_svg0_835_19201"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#PermissionManagement-master_svg0_835_19201)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m13.635 1.438 6.673 3.837A3.4 3.4 0 0 1 22 8.23v7.542a3.4 3.4 0 0 1-1.692 2.954l-6.673 3.837a3.27 3.27 0 0 1-3.27 0l-6.673-3.837A3.4 3.4 0 0 1 2 15.77V8.229c0-1.224.647-2.352 1.692-2.954l6.673-3.837a3.27 3.27 0 0 1 3.27 0m1.638 6.322c0 1.39-.906 2.612-2.218 2.991v2.945h2.218v1.695h-2.218v3.392H11.39v-8.032c-1.313-.379-2.219-1.6-2.219-2.99 0-1.718 1.366-3.11 3.05-3.11 1.685 0 3.05 1.392 3.05 3.11"
  })));
}
export default PermissionManagement;