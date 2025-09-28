import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function ArrowUpLeft(props: IconProps): React.ReactElement {
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
    id: "ArrowUpLeft-master_svg0_172_049"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#ArrowUpLeft-master_svg0_172_049)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m10.479 5.597 2.859-2.859a.667.667 0 0 0 0-.943l-.006-.006a.667.667 0 0 0-.937.006L8.433 5.758a.67.67 0 0 0-.233.506v.003c0 .176.07.346.195.471l4 4a.667.667 0 0 0 .943-.943l-2.865-2.864h6.393a.667.667 0 0 0 0-1.334z",
    transform: "rotate(45 8.2 1.6)"
  })));
}
export default ArrowUpLeft;