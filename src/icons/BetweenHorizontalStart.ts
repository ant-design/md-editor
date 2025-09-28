import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function BetweenHorizontalStart(props: IconProps): React.ReactElement {
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
    id: "BetweenHorizontalStart-master_svg0_1231_36614"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#BetweenHorizontalStart-master_svg0_1231_36614)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 9V4q0-.828.586-1.414T9 2h11q.828 0 1.414.586T22 4v5q0 .828-.586 1.414T20 11H9q-.828 0-1.414-.586T7 9m2 0h11V4H9zm-6.293-.707 3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0 1 1-1.414-1.415L3.586 12 1.293 9.707a1 1 0 1 1 1.414-1.414M7 20v-5q0-.828.586-1.414T9 13h11q.828 0 1.414.586T22 15v5q0 .828-.586 1.414T20 22H9q-.828 0-1.414-.586T7 20m2 0h11v-5H9z",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default BetweenHorizontalStart;