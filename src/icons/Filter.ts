import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Filter(props: IconProps): React.ReactElement {
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
    id: "Filter-master_svg0_824_18481"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Filter-master_svg0_824_18481)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15.176 2.43 10 8.55V14a.667.667 0 0 1-.965.596L6.37 13.263A.67.67 0 0 1 6 12.667V8.55L.824 2.43a.667.667 0 0 1 .51-1.098h13.333a.667.667 0 0 1 .509 1.098M8.824 7.877l4.406-5.21H2.77l4.406 5.21c.101.12.157.273.157.43v3.949l1.334.666V8.307c0-.158.055-.31.157-.43"
  })));
}
export default Filter;