import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Summary(props: IconProps): React.ReactElement {
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
    id: "Summary-master_svg0_1278_36486"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Summary-master_svg0_1278_36486)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 15V4a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-8v3h4.5a1 1 0 1 1 0 2h-11a1 1 0 1 1 0-2H11v-3H3a2 2 0 0 1-2-2m5-8h2v6H6zm5 2h2v4h-2zm5 0h2v4h-2z"
  })));
}
export default Summary;