import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function ServiceEntrance(props: IconProps): React.ReactElement {
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
    id: "ServiceEntrance-master_svg0_549_14773"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#ServiceEntrance-master_svg0_549_14773)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M14.707 4v7.22h7.258c.571 0 1.034-.448 1.034-1V3H15.74c-.571 0-1.034.447-1.034 1M4.499 6v4.22c0 .552.463 1 1.034 1h7.259V4c0-.553-.463-1-1.034-1H7.6C5.888 3 4.499 4.341 4.499 6m0 8.116v7.22h7.259c.57 0 1.034-.447 1.034-1v-7.22H5.533c-.57 0-1.034.448-1.034 1m10.208-1v7.22c0 .553.463 1 1.034 1h4.156c1.713 0 3.102-1.343 3.102-3v-4.22c0-.552-.463-1-1.034-1z",
    transform: "matrix(1 0 -.1908 .98163 .572 .055)"
  })));
}
export default ServiceEntrance;