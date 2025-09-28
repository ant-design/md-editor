import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function FileImage(props: IconProps): React.ReactElement {
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
    id: "FileImage-master_svg0_2197_15963"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#FileImage-master_svg0_2197_15963)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1.999 18.34V5.66q0-1.516 1.072-2.588T5.659 2h12.678q1.516 0 2.588 1.072t1.072 2.588V15a1 1 0 0 1 0 .088v3.253q0 1.516-1.072 2.588t-2.588 1.073H5.659q-1.516 0-2.588-1.073T1.999 18.34m18.255-5.402V5.66q0-.794-.561-1.355-.562-.562-1.356-.562H5.659q-.794 0-1.356.562-.561.561-.561 1.355V18.34q0 .794.561 1.356.525.524 1.252.559l8.958-8.958q.85-.85 2.05-.85 1.201 0 2.05.85zm-12.236 7.32 7.727-7.729q.34-.338.818-.338.48 0 .818.338l2.873 2.874v2.937q0 .794-.561 1.356-.562.561-1.356.561zm3.838-11.3a2.9 2.9 0 1 1-5.8 0 2.9 2.9 0 0 1 5.8 0m-1.744 0a1.157 1.157 0 1 0-2.313 0 1.157 1.157 0 0 0 2.313 0"
  })));
}
export default FileImage;