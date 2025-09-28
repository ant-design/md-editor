import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function ArrowLeft(props: IconProps): React.ReactElement {
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
    id: "ArrowLeft-master_svg0_172_3335"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#ArrowLeft-master_svg0_172_3335)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m5.612 7.33 2.86-2.859a.667.667 0 0 0-.001-.943l-.006-.006a.667.667 0 0 0-.937.007L3.566 7.49a.67.67 0 0 0-.233.506V8c0 .178.07.347.196.472l4 4a.667.667 0 0 0 .942-.942L5.607 8.664H12a.667.667 0 0 0 0-1.334z",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default ArrowLeft;