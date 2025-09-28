import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function ExpandAlt(props: IconProps): React.ReactElement {
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
    id: "ExpandAlt-master_svg0_2197_13716"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#ExpandAlt-master_svg0_2197_13716)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M13 4h6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V6h-5a1 1 0 1 1 0-2m-9 9a1 1 0 1 1 2 0v5h5a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1z",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default ExpandAlt;