import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function PodManagement(props: IconProps): React.ReactElement {
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
    id: "PodManagement-master_svg0_835_18423"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#PodManagement-master_svg0_835_18423)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M22 7.58c0-.772-.42-1.485-1.1-1.87l-7.8-4.42a2.24 2.24 0 0 0-2.2 0L3.1 5.71A2.15 2.15 0 0 0 2 7.58v8.84c0 .772.42 1.484 1.1 1.87l7.8 4.42c.68.386 1.52.386 2.2 0l7.8-4.42a2.15 2.15 0 0 0 1.1-1.87zM4 7.5l7 3.5 8-4-7-4zM12 21v-8l8-4v7.5z"
  })));
}
export default PodManagement;