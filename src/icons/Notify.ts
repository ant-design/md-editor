import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Notify(props: IconProps): React.ReactElement {
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
    id: "Notify-master_svg0_sa1814_80659"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Notify-master_svg0_sa1814_80659)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M22 18.71c-.085-1.768-.996-3.408-2.488-4.476V9.297c0-2.852-2.157-5.252-5.006-5.818v-.114C14.506 2.065 13.378 1 12 1S9.494 2.064 9.494 3.366v.114c-2.85.565-5.006 2.964-5.006 5.817v4.939C2.996 15.303 2.084 16.943 2 18.71h2.488v.015h15.024v-.015zM11.47 23h.622c1.631 0 2.986-1.164 3.185-2.655H8.73c.206 1.516 1.569 2.652 3.184 2.655z",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default Notify;