import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function FileMarkdown(props: IconProps): React.ReactElement {
  return /*#__PURE__*/React.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24"
  }, props, {
    style: Object.assign({
      verticalAlign: '-0.125em'
    }, props.style),
    className: ['sofa-icons-icon', props.className].filter(Boolean).join(' '),
    width: "1em",
    height: "1em"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#23D6DC",
    fillRule: "evenodd",
    d: "M4 20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2zm3.5-4H6v-6h2l1.5 2.5L11 10h2v6h-1.5v-4l-2 3-2-3zm6.5-3 2 3 2-3h-1v-3h-2v3z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#A2F7FA",
    d: "M15 6a1 1 0 0 0 1 1h4l-5-5z"
  }));
}
export default FileMarkdown;