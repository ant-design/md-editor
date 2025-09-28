import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function AlignLeft(props: IconProps): React.ReactElement {
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
    id: "AlignLeft-master_svg0_2413_13458"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#AlignLeft-master_svg0_2413_13458)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M3,17L17,17C17.552300000000002,17,18,17.447699999999998,18,18C18,18.552300000000002,17.552300000000002,19,17,19L3,19C2.447715,19,2,18.552300000000002,2,18C2,17.447699999999998,2.447715,17,3,17ZM3,5L21,5C21.5523,5,22,5.447715,22,6C22,6.55228,21.5523,7,21,7L3,7C2.447715,7,2,6.55228,2,6C2,5.447715,2.447715,5,3,5ZM3,11L15,11C15.5523,11,16,11.44772,16,12C16,12.55228,15.5523,13,15,13L3,13C2.447715,13,2,12.55228,2,12C2,11.44772,2.447715,11,3,11Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default AlignLeft;