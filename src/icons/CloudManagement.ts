import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function CloudManagement(props: IconProps): React.ReactElement {
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
    id: "CloudManagement-master_svg0_1036_31635"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#CloudManagement-master_svg0_1036_31635)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M23 14.504q0 2.277-1.61 3.886Q19.778 20 17.5 20H9.002q-3.089 0-5.376-2.076-2.286-2.076-2.584-5.149-.297-3.072 1.55-5.547T7.467 4.16t5.675 1.006q2.315 1.399 3.28 3.842H17.5q2.278 0 3.888 1.61Q23 12.228 23 14.504",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default CloudManagement;