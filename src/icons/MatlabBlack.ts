import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function MatlabBlack(props: IconProps): React.ReactElement {
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
    id: "MatlabBlack-master_svg0_970_26881"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 48,
    height: 48,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#MatlabBlack-master_svg0_970_26881)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M32.171 2.321v-.07h-.026q-.185 0-.363.03-.282.015-.556.157c-1.377.566-2.463 2.37-3.775 4.555-1.922 3.201-4.312 7.184-8.412 8.186-1.617.395-3.529 2.686-5.348 4.999l-.455.575-.046.056L.047 26.245l10.655 7.501c4.474-2.1 5.843 1.923 9.547 12.003 7.455-.837 12.457-12.751 16.611-13.534 5.152-.97 5.584 2.975 11.093 6.373-5.536-11.976-11.412-35.15-15.782-36.267M16.127 29.654l-5.324 2.699-8.286-5.834 11.17-4.619 2.168 1.611 3.318 2.517a30.6 30.6 0 0 1-3.046 3.626m3.755-4.642-3.306-2.457-2.024-1.535.08-.102c1.167-1.484 3.34-4.246 4.691-4.576 3.768-.92 6.15-3.934 8.008-6.86-1.792 4.516-4.014 10.426-7.449 15.53",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default MatlabBlack;