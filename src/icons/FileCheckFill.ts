import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function FileCheckFill(props: IconProps): React.ReactElement {
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
    id: "FileCheckFill-master_svg0_2177_25345"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#FileCheckFill-master_svg0_2177_25345)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M13 1H6q-1.243 0-2.121.879Q3 2.757 3 4v16q0 1.243.879 2.121Q4.757 23 6 23h12q1.243 0 2.121-.879Q21 21.243 21 20V9h-5q-1.243 0-2.121-.879Q13 7.243 13 6zm8 6h-5q-.414 0-.707-.293T15 6V1a1 1 0 0 1 .707.293l5 5A1 1 0 0 1 21 7m-5.293 6.707a1 1 0 1 0-1.415-1.414L11 15.586l-1.293-1.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0z",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default FileCheckFill;