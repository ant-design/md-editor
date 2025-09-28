import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function HumanStar(props: IconProps): React.ReactElement {
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
    id: "HumanStar-master_svg0_824_41366"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#HumanStar-master_svg0_824_41366)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10.122 1.5a3.75 3.75 0 0 1 3.733 4.152l-.242 2.184a3.507 3.507 0 0 1-3.49 3.114A3.507 3.507 0 0 1 6.63 7.836L6.39 5.652A3.744 3.744 0 0 1 10.122 1.5m7.512 21c2.964 0 5.366-2.35 5.366-5.25S20.598 12 17.634 12s-5.366 2.35-5.366 5.25 2.403 5.25 5.366 5.25M1 17.592c0-2.984 3.752-5.067 9.122-5.067.821 0 1.605.049 2.343.142a6.72 6.72 0 0 0-1.806 4.583c0 2.111.98 3.998 2.518 5.25H2.073C1.48 22.5 1 22.03 1 21.45zm17.795-1.77-1.16-2.247-1.162 2.247-2.595.36 1.878 1.749-.443 2.469 2.321-1.166 2.322 1.166-.444-2.47 1.878-1.748z"
  })));
}
export default HumanStar;