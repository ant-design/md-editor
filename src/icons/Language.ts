import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Language(props: IconProps): React.ReactElement {
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
    id: "Language-master_svg0_280_00713"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Language-master_svg0_280_00713)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9.54 13.02a5.26 5.26 0 0 0 3.668-4.353h-2.231q-.098 1.396-.605 2.71-.337.87-.831 1.643m1.437-5.687h2.23A5.26 5.26 0 0 0 9.542 2.98q.494.773.83 1.644.508 1.313.606 2.71M7.998 1.417a6.583 6.583 0 0 0 0 13.166h.003a6.583 6.583 0 0 0 0-13.166h-.003M6.46 2.98q-.494.773-.831 1.644-.508 1.313-.605 2.71H2.792A5.26 5.26 0 0 1 6.459 2.98M6.36 7.333q.094-1.147.512-2.228Q7.292 4.017 8 3.107q.708.91 1.128 1.998.418 1.08.512 2.228zm0 1.334h3.28q-.094 1.147-.512 2.228-.42 1.088-1.128 1.997-.708-.91-1.128-1.997-.418-1.08-.512-2.228m-1.337 0H2.792a5.26 5.26 0 0 0 3.667 4.353q-.494-.773-.831-1.644-.508-1.313-.605-2.71",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default Language;