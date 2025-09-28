import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Cas(props: IconProps): React.ReactElement {
  return /*#__PURE__*/React.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 48 48",
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
    id: "Cas-master_svg0_1_0691"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 48,
    height: 48,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Cas-master_svg0_1_0691)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M41.004 13.264a2 2 0 0 1 1 1.732v18.545a2 2 0 0 1-1 1.732l-16.06 9.272a2 2 0 0 1-2 0l-.216-.124-.167-16.179q-.024-1.365-.714-2.544-.69-1.178-1.87-1.867l-14.08-9.055a2 2 0 0 1 .987-1.512l16.06-9.272a2 2 0 0 1 2 0zM26.45 8.161v-.007c-.004-.364.433-.464.748-.28L38.203 14.3q.707.413 1.121 1.12t.429 1.527l.223 12.785c.006.354-.289.675-.596.498l-.006-.003-4.637-2.708a2 2 0 0 1-.99-1.692l-.07-3.93q-.023-1.365-.713-2.543t-1.87-1.867l-3.556-2.077a2 2 0 0 1-.991-1.692zm3.592 11.126L18.967 12.82c-.235-.137-.55-.043-.546.228v.005l.1 5.748a2 2 0 0 0 .992 1.692l2.771 1.619q1.18.689 1.87 1.867.69 1.179.714 2.544l.065 3.739a2 2 0 0 0 .991 1.692l5.422 3.166.004.002c.235.136.47-.093.466-.364l-.223-12.824q-.015-.82-.429-1.526t-1.122-1.12m-9.566 8.991.154 14.931-13.746-7.936a2 2 0 0 1-1-1.732V17.245l13.042 8.387q.707.413 1.122 1.12.414.707.428 1.526"
  })));
}
export default Cas;