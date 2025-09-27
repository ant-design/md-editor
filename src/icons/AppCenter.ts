import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function AppCenter(props: IconProps): React.ReactElement {
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
    id: "AppCenter-master_svg0_745_10834"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#AppCenter-master_svg0_745_10834)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 4v5q0 .829.586 1.414Q3.17 11 4 11h5q.828 0 1.414-.586Q11 9.83 11 9V4q0-.828-.586-1.414T9 2H4q-.829 0-1.414.586Q2 3.172 2 4m7 5H4V4h5zm-7 6v5q0 .829.586 1.414Q3.17 22 4 22h5q.828 0 1.414-.586Q11 20.83 11 20v-5q0-.828-.586-1.414T9 13H4q-.829 0-1.414.586Q2 14.172 2 15m7 5H4v-5h5zm4-16v5q0 .829.586 1.414Q14.17 11 15 11h5q.828 0 1.414-.586Q22 9.83 22 9V4q0-.828-.586-1.414T20 2h-5q-.829 0-1.414.586Q13 3.172 13 4m7 5h-5V4h5zm-7 6v5q0 .829.586 1.414Q14.17 22 15 22h5q.828 0 1.414-.586Q22 20.83 22 20v-5q0-.828-.586-1.414T20 13h-5q-.829 0-1.414.586Q13 14.172 13 15m7 5h-5v-5h5z"
  })));
}
export default AppCenter;