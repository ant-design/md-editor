import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function FileSearch(props: IconProps): React.ReactElement {
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
    id: "FileSearch-master_svg0_2211_13412"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#FileSearch-master_svg0_2211_13412)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 4v3a1 1 0 0 0 2 0V4q0-1 1-1h7v3q0 1.243.879 2.121Q15.757 9 17 9h3v11q0 1-1 1H6.995q-.572-.002-.86-.498l-.001-.002a1 1 0 1 0-1.732 1q.863 1.496 2.593 1.5H19q1.243 0 2.121-.879Q22 21.243 22 20V7a1 1 0 0 0-.293-.707l-5-5A1 1 0 0 0 16 1H7q-1.243 0-2.121.879Q4 2.757 4 4m12-.586V6q0 .414.293.707T17 7h2.586zM6 18c.742 0 1.436-.202 2.032-.554l1.26 1.261a1 1 0 0 0 1.415-1.414l-1.26-1.261A4 4 0 1 0 6 18m0-6a2 2 0 1 1 0 4 2 2 0 0 1 0-4",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default FileSearch;