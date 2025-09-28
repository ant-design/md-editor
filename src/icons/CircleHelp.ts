import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function CircleHelp(props: IconProps): React.ReactElement {
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
    id: "CircleHelp-master_svg0_339_8609"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#CircleHelp-master_svg0_339_8609)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 15.333A7.333 7.333 0 1 0 8 .667a7.333 7.333 0 0 0 0 14.666M8 2a6 6 0 1 1 0 12A6 6 0 0 1 8 2m-.264 6.034h.001Q9.28 7.519 9.28 6.667q0-.489-.313-.862-.314-.373-.795-.455-.48-.083-.9.164t-.583.707a.667.667 0 0 1-1.258-.442q.324-.92 1.165-1.414.84-.494 1.802-.33.96.165 1.589.911.628.746.626 1.72 0 1.815-2.455 2.633a.667.667 0 0 1-.422-1.265M8 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2"
  })));
}
export default CircleHelp;