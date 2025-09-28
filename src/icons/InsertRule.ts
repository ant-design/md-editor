import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function InsertRule(props: IconProps): React.ReactElement {
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
    id: "InsertRule-master_svg0_1231_36594"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#InsertRule-master_svg0_1231_36594)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m5.707 11.293-3-3a1 1 0 1 0-1.414 1.414L3.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414l3-3a1 1 0 0 0 0-1.414M7 7.975v8q0 .828.586 1.414T9 17.975h11q.828 0 1.414-.586T22 15.975v-8q0-.829-.586-1.414-.586-.586-1.414-.586H9q-.828 0-1.414.586Q7 7.146 7 7.975m13 8H9v-8h11z",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default InsertRule;