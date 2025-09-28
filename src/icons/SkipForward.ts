import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function SkipForward(props: IconProps): React.ReactElement {
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
    id: "SkipForward-master_svg0_2328_13363"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#SkipForward-master_svg0_2328_13363)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M20,19L20,5C20,4.44772,19.552300000000002,4,19,4C18.447699999999998,4,18,4.44772,18,5L18,19C18,19.5523,18.447699999999998,20,19,20C19.552300000000002,20,20,19.5523,20,19ZM4,20L4,4C4,3.447715,4.447715,3,5,3C5.22707,3,5.44738,3.0772808,5.62469,3.219131L15.6247,11.21913C16.055999999999997,11.56414,16.1259,12.19343,15.7809,12.62469C15.7347,12.68236,15.6824,12.73474,15.6247,12.78087L5.62469,20.7809C5.4176,20.9465,5.15316,21.0232,4.889568,20.9939C4.625975,20.9646,4.38481,20.8318,4.219131,20.6247C4.077281,20.4474,4,20.2271,4,20ZM13.39922,12L6,17.9194L6,6.08063L13.39922,12Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default SkipForward;