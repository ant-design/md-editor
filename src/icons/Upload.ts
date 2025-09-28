import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Upload(props: IconProps): React.ReactElement {
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
    id: "Upload-master_svg0_308_02291"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Upload-master_svg0_308_02291)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4.195 4.862 7.53 1.529a.665.665 0 0 1 .942 0l3.334 3.333a.667.667 0 1 1-.943.943L8.667 3.61V10a.667.667 0 1 1-1.334 0V3.61L5.138 5.805a.667.667 0 1 1-.943-.943M1.333 10a.667.667 0 1 1 1.334 0v2.667q0 .276.195.471t.471.195h9.334q.276 0 .471-.195t.195-.471V10a.667.667 0 0 1 1.334 0v2.667q0 .828-.586 1.414t-1.414.586H3.333q-.828 0-1.414-.586t-.586-1.414z"
  })));
}
export default Upload;