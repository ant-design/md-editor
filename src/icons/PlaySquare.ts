import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function PlaySquare(props: IconProps): React.ReactElement {
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
    id: "PlaySquare-master_svg0_2197_15835"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#PlaySquare-master_svg0_2197_15835)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1.999 5.661V18.34q0 1.516 1.072 2.588t2.588 1.073h12.679q1.516 0 2.588-1.073T22 18.34V5.66q0-1.516-1.073-2.588T18.338 2H5.659Q4.143 2 3.071 3.073T1.999 5.66m2.305 14.035q-.562-.562-.562-1.356V5.66q0-.794.562-1.355.561-.562 1.355-.562h12.679q.794 0 1.356.562.561.561.561 1.355V18.34q0 .794-.561 1.356-.562.561-1.356.561H5.659q-.794 0-1.355-.561m4.702-3.638V7.944a.872.872 0 0 1 1.355-.726l6.086 4.057a.872.872 0 0 1 0 1.45l-6.086 4.058a.872.872 0 0 1-1.355-.725M14.392 12l-3.643 2.428V9.572z"
  })));
}
export default PlaySquare;