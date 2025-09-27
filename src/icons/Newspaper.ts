import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Newspaper(props: IconProps): React.ReactElement {
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
    id: "Newspaper-master_svg0_2879_14325"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Newspaper-master_svg0_2879_14325)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M5,8L5,4Q5,2.7573600000000003,5.87868,1.8786800000000001Q6.75736,1,8,1L20,1Q21.2426,1,22.1213,1.8786800000000001Q23,2.7573600000000003,23,4L23,20Q23,21.2426,22.1213,22.1213Q21.2426,23,20,23L4,23Q2.7573600000000003,23,1.8786800000000001,22.1213Q1,21.2426,1,20L1,11Q1,9.75736,1.8786800000000001,8.87868Q2.7573600000000003,8,4,8L5,8ZM6.83801,21L20,21Q21,21,21,20L21,4Q21,3,20,3L8,3Q7.58579,3,7.29289,3.29289Q7,3.58579,7,4L7,9L7,20Q7,20.5336,6.83801,21ZM9,7L9,9Q9,9.82843,9.58579,10.41421Q10.17157,11,11,11L17,11Q17.8284,11,18.4142,10.41421Q19,9.82843,19,9L19,7Q19,6.17157,18.4142,5.58579Q17.8284,5,17,5L11,5Q10.17157,5,9.58579,5.58579Q9,6.17157,9,7ZM17,9L11,9L11,7L17,7L17,9ZM4,21Q3,21,3,20L3,11Q3,10,4,10L5,10L5,20Q5,21,4,21ZM10,13L18,13C18.5523,13,19,13.4477,19,14C19,14.5523,18.5523,15,18,15L10,15C9.44771,15,9,14.5523,9,14C9,13.4477,9.44771,13,10,13ZM10,17L15,17C15.5523,17,16,17.4477,16,18C16,18.5523,15.5523,19,15,19L10,19C9.44771,19,9,18.5523,9,18C9,17.4477,9.44771,17,10,17Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default Newspaper;