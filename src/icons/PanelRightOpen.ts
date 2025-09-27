import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function PanelRightOpen(props: IconProps): React.ReactElement {
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
    id: "PanelRightOpen-master_svg0_363_02061"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#PanelRightOpen-master_svg0_363_02061)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1.333 12.667V3.333q0-.828.586-1.414t1.414-.586h9.334q.828 0 1.414.586t.586 1.414v9.334q0 .828-.586 1.414t-1.414.586H3.333q-.828 0-1.414-.586t-.586-1.414m4-10h-2q-.276 0-.471.195t-.195.471v9.334q0 .276.195.471t.471.195h2zm1.334 10.666V2.667h6q.276 0 .471.195t.195.471v9.334q0 .276-.195.471t-.471.195zm4.47-6.862a.667.667 0 1 0-.942-.942l-2 2a.667.667 0 0 0 0 .942l2 2a.667.667 0 1 0 .943-.943L9.609 8z"
  })));
}
export default PanelRightOpen;