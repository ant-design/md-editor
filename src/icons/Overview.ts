import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Overview(props: IconProps): React.ReactElement {
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
    id: "Overview-master_svg0_835_18815"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Overview-master_svg0_835_18815)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1.22 14.14q.581 2.923 2.525 5.117l8.26-8.26V1q-3.336 0-6.11 1.853-2.773 1.853-4.05 4.935T1.22 14.14m13.198-7.727 3-2.999L16.002 2l-2.998 3zm1 3.998 5.997-5.998L20.002 3l-5.999 5.998zm6.997-1.999-2.999 2.999-1.413-1.414 2.999-2.999zM23 11.996q0 3.335-1.853 6.109t-4.935 4.05-6.353.625q-2.626-.522-4.664-2.145l8.638-8.64z"
  })));
}
export default Overview;