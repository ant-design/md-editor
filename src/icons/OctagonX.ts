import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function OctagonX(props: IconProps): React.ReactElement {
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
    id: "OctagonX-master_svg0_740_13536"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#OctagonX-master_svg0_740_13536)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m1.253 11.622 3.125 3.125q.586.586 1.414.586h4.416q.828 0 1.414-.586l3.125-3.125q.586-.586.586-1.414V5.792q0-.828-.586-1.414l-3.125-3.125q-.586-.586-1.414-.586H5.792q-.828 0-1.414.586L1.253 4.378q-.586.586-.586 1.414v4.416q0 .828.586 1.414M5.792 14q-.276 0-.471-.195l-3.126-3.126Q2 10.484 2 10.208V5.792q0-.276.195-.471l3.126-3.126Q5.516 2 5.792 2h4.416q.276 0 .471.195l3.126 3.126q.195.195.195.471v4.416q0 .276-.195.471l-3.126 3.126q-.195.195-.471.195zm4.875-8c0 .177-.07.346-.196.471L8.943 8l1.528 1.528a.667.667 0 1 1-.943.943L8 8.943 6.471 10.47a.667.667 0 0 1-.942-.942L7.057 8 5.53 6.471a.667.667 0 1 1 .942-.942L8 7.057 9.528 5.53A.667.667 0 0 1 10.667 6"
  })));
}
export default OctagonX;