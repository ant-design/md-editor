import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function ForceTypology(props: IconProps): React.ReactElement {
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
    id: "ForceTypology-master_svg0_824_19308"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#ForceTypology-master_svg0_824_19308)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 4.667a2 2 0 1 0-1.4-.573L8.183 5.34a2.667 2.667 0 0 0-2.712 3.512l-1.212.606a2 2 0 1 0 .405 1.288l1.543-.771a2.66 2.66 0 0 0 2.502.596.7.7 0 0 0 .152.234l1.904 1.904a2 2 0 1 0 .824-1.061L9.857 9.913a2.664 2.664 0 0 0-.408-4.153l.368-1.103q.09.009.183.009M10 2a.667.667 0 1 1 0 1.333A.667.667 0 0 1 10 2M8 6.667a1.333 1.333 0 1 1 0 2.666 1.333 1.333 0 0 1 0-2.666M2.667 10a.667.667 0 1 1 0 1.333.667.667 0 0 1 0-1.333m10.666 3.333a.667.667 0 1 0-1.333 0 .667.667 0 0 0 1.333 0"
  })));
}
export default ForceTypology;