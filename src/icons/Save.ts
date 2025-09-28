import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Save(props: IconProps): React.ReactElement {
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
    id: "Save-master_svg0_1308_37698"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Save-master_svg0_1308_37698)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15.2 2H5q-1.243 0-2.121.879Q2 3.757 2 5v14q0 1.243.879 2.121Q3.757 22 5 22h14q1.243 0 2.121-.879Q22 20.243 22 19V8.786q-.018-1.236-.893-2.093L17.314 2.9Q16.45 2.018 15.2 2M18 20h1q1 0 1-1V8.814q-.006-.412-.307-.707L15.886 4.3q-.288-.294-.686-.3H8v3h7a1 1 0 1 1 0 2H8q-.828 0-1.414-.586T6 7V4H5Q4 4 4 5v14q0 1 1 1h1v-6q0-.828.586-1.414T8 12h8q.828 0 1.414.586T18 14zM8 20v-6h8v6z",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default Save;