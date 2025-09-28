import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function ChartLine(props: IconProps): React.ReactElement {
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
    id: "ChartLine-master_svg0_388_03628"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#ChartLine-master_svg0_388_03628)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1.333 2a.667.667 0 0 1 1.334 0v10.667q0 .276.195.471t.471.195H14a.667.667 0 0 1 0 1.334H3.333q-.828 0-1.414-.586t-.586-1.414zm11.805 4.471a.666.666 0 1 0-.943-.942L9.333 8.39 7.138 6.195a.667.667 0 0 0-.943 0l-2 2a.667.667 0 1 0 .943.943l1.529-1.529 2.195 2.196a.667.667 0 0 0 .943 0z"
  })));
}
export default ChartLine;