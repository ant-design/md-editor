import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Monitor(props: IconProps): React.ReactElement {
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
    id: "Monitor-master_svg0_2994_23027"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Monitor-master_svg0_2994_23027)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M1,15L1,5Q1,3.7573600000000003,1.878679,2.878679Q2.7573600000000003,2,4,2L20,2Q21.2426,2,22.1213,2.87868Q23,3.7573600000000003,23,5L23,15Q23,16.2426,22.1213,17.121299999999998Q21.2426,18,20,18L13,18L13,20L16,20C16.552300000000002,20,17,20.4477,17,21C17,21.5523,16.552300000000002,22,16,22L8,22C7.44772,22,7,21.5523,7,21C7,20.4477,7.44772,20,8,20L11,20L11,18L4,18Q2.7573600000000003,18,1.878679,17.121299999999998Q1,16.2426,1,15ZM12,16L20,16Q20.4142,16,20.7071,15.7071Q21,15.4142,21,15L21,5Q21,4.585789999999999,20.7071,4.29289Q20.4142,4,20,4L4,4Q3.58579,4,3.29289,4.29289Q3,4.585789999999999,3,5L3,15Q3,15.4142,3.29289,15.7071Q3.58579,16,4,16L12,16Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default Monitor;