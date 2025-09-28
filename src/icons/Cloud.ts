import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Cloud(props: IconProps): React.ReactElement {
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
    id: "Cloud-master_svg0_1036_27178"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Cloud-master_svg0_1036_27178)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 12a8 8 0 0 0 5.187 7.491A5.5 5.5 0 0 0 8.5 20h9a5.5 5.5 0 1 0 0-11h-1.081A8.003 8.003 0 0 0 1 12m5.89 5.62.07.026.069.031Q7.724 18 8.5 18h9q1.45 0 2.475-1.025T21 14.5t-1.025-2.475T17.5 11h-2.43l-.505-1.25Q13.047 6 9 6 6.515 6 4.757 7.757 3 9.515 3 12q0 4.158 3.89 5.62"
  })));
}
export default Cloud;