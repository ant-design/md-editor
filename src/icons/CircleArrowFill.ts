import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function CircleArrowFill(props: IconProps): React.ReactElement {
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
    id: "CircleArrowFill-master_svg0_2790_14188"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#CircleArrowFill-master_svg0_2790_14188)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M23,12C23,18.0751,18.0751,23,12,23C5.92487,23,1,18.0751,1,12C1,5.92487,5.92487,1,12,1C18.0751,1,23,5.92487,23,12ZM11.2923,7.29352L7.29289,11.2929C7.10536,11.4804,7,11.7348,7,12C7,12.5523,7.44772,13,8,13C8.26522,13,8.51957,12.8946,8.70711,12.7071L11,10.41421L11,16C11,16.552300000000002,11.4477,17,12,17C12.5523,17,13,16.552300000000002,13,16L13,10.41421L15.2929,12.7071C15.4804,12.8946,15.7348,13,16,13C16.552300000000002,13,17,12.5523,17,12C17,11.7348,16.8946,11.4804,16.7071,11.2929L12.7074,7.29322L12.7074,7.29322C12.5261,7.11193,12.2761,7,12,7C11.7348,7,11.4804,7.10536,11.2923,7.29352L11.2923,7.29352Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default CircleArrowFill;