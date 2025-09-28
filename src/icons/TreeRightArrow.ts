import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function TreeRightArrow(props: IconProps): React.ReactElement {
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
    id: "TreeRightArrow-master_svg0_1378_40544"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#TreeRightArrow-master_svg0_1378_40544)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m10.147 15.856 3.147 3.146a1 1 0 0 0 1.414 0l3.147-3.146a.5.5 0 0 0-.354-.854h-7a.5.5 0 0 0-.354.854",
    transform: "rotate(-90 10 15.002)"
  })));
}
export default TreeRightArrow;