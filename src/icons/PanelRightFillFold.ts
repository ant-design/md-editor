import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function PanelRightFillFold(props: IconProps): React.ReactElement {
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
    id: "PanelRightFillFold-master_svg0_2774_15351"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#PanelRightFillFold-master_svg0_2774_15351)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M2,19L2,5Q2,3.7573600000000003,2.878679,2.87868Q3.7573600000000003,2,5,2L19,2Q20.2426,2,21.1213,2.87868Q22,3.7573600000000003,22,5L22,19Q22,20.2426,21.1213,21.1213Q20.2426,22,19,22L5,22Q3.7573600000000003,22,2.878679,21.1213Q2,20.2426,2,19ZM4,19Q4,20,5,20L19,20Q20,20,20,19L20,5Q20,4,19,4L5,4Q4,4,4,5L4,19ZM17,6C17,5.44772,17.447699999999998,5,18,5C18.5523,5,19,5.44772,19,6L19,18C19,18.5523,18.5523,19,18,19C17.447699999999998,19,17,18.5523,17,18L17,6Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default PanelRightFillFold;