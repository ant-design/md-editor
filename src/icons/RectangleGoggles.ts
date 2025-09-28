import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function RectangleGoggles(props: IconProps): React.ReactElement {
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
    id: "RectangleGoggles-master_svg0_2994_24076"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#RectangleGoggles-master_svg0_2994_24076)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M4,5L20,5Q21.2426,5,22.1213,5.87868Q23,6.75736,23,8L23,16Q23,17.2426,22.1213,18.121299999999998Q21.2426,19,20,19L16,19Q14.5,19,13.6,17.8L12.0005,15.6706L12.0005,15.6706L10.39955,17.8006Q9.5,19,8,19L4,19Q2.7573600000000003,19,1.8786800000000001,18.121299999999998Q1.0000000596046,17.2426,1,16L1,8Q1.0000000596046,6.75736,1.8786800000000001,5.87868Q2.7573600000000003,5,4,5ZM4,7Q3.58579,7,3.29289,7.29289Q3,7.585789999999999,3,8L3,16Q3,16.4142,3.29289,16.7071Q3.58579,17,4,17L8,17Q8.5,17,8.80045,16.5994L10.4,14.47Q11,13.67,12,13.67Q13,13.67,13.5995,14.4694L15.2,16.6Q15.5,17,16,17L20,17Q20.4142,17,20.7071,16.7071Q21,16.4142,21,16L21,8Q21,7.585789999999999,20.7071,7.29289Q20.4142,7,20,7L4,7Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default RectangleGoggles;