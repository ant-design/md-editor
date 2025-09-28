import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function ArrowRight(props: IconProps): React.ReactElement {
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
    id: "ArrowRight-master_svg0_339_8581"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#ArrowRight-master_svg0_339_8581)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m8.472 2.862 4.666 4.667a.664.664 0 0 1 0 .942l-4.667 4.667a.667.667 0 1 1-.942-.943l3.528-3.528H3.333a.667.667 0 0 1 0-1.334h7.724L7.53 3.805a.667.667 0 1 1 .943-.943"
  })));
}
export default ArrowRight;