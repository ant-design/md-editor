import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function CirclePlay(props: IconProps): React.ReactElement {
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
    id: "CirclePlay-master_svg0_2336_15074"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#CirclePlay-master_svg0_2336_15074)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M23,12C23,18.0751,18.0751,23,12,23C5.92487,23,1,18.0751,1,12C1,5.92487,5.92487,1,12,1C18.0751,1,23,5.92487,23,12ZM21,12C21,7.02944,16.970599999999997,3,12,3C7.02944,3,3,7.02944,3,12C3,16.970599999999997,7.02944,21,12,21C16.970599999999997,21,21,16.970599999999997,21,12ZM10,7C9.44771,7,9,7.44772,9,8L9,16C9,16.197400000000002,9.05844,16.3904,9.16795,16.5547C9.31507,16.775399999999998,9.54382,16.9286,9.80388,16.980600000000003C10.06395,17.0326,10.33403,16.9792,10.5547,16.8321L16.5547,12.8321C16.6646,12.7588,16.7588,12.6646,16.8321,12.5547C16.9792,12.334,17.0326,12.064,16.980600000000003,11.8039C16.9286,11.5438,16.775399999999998,11.3151,16.5547,11.1679L10.5547,7.16795C10.39043,7.05844,10.19742,7,10,7ZM11,14.1315L14.1972,12L11,9.86852L11,14.1315Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default CirclePlay;