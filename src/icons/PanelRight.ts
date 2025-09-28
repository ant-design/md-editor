import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function PanelRight(props: IconProps): React.ReactElement {
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
    id: "PanelRight-master_svg0_824_18491"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#PanelRight-master_svg0_824_18491)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1.333 12.667V3.333q0-.828.586-1.414t1.414-.586h9.334q.828 0 1.414.586t.586 1.414v9.334q0 .828-.586 1.414t-1.414.586H3.333q-.828 0-1.414-.586t-.586-1.414m9.334.666h2q.276 0 .471-.195t.195-.471V3.333q0-.276-.195-.471t-.471-.195h-2zM9.333 2.667v10.666h-6q-.276 0-.471-.195t-.195-.471V3.333q0-.276.195-.471t.471-.195z"
  })));
}
export default PanelRight;