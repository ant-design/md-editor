import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Download(props: IconProps): React.ReactElement {
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
    id: "Download-master_svg0_308_02297"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Download-master_svg0_308_02297)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7.333 2v6.39L5.138 6.196a.667.667 0 1 0-.943.943l3.333 3.333a.665.665 0 0 0 .943 0l3.333-3.333a.667.667 0 0 0-.942-.943L8.667 8.391V2a.667.667 0 1 0-1.334 0m-6 8a.667.667 0 1 1 1.334 0v2.667q0 .276.195.471t.471.195h9.334q.276 0 .471-.195t.195-.471V10a.667.667 0 0 1 1.334 0v2.667q0 .828-.586 1.414t-1.414.586H3.333q-.828 0-1.414-.586t-.586-1.414z"
  })));
}
export default Download;