import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function History(props: IconProps): React.ReactElement {
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
    id: "History-master_svg0_2407_13451"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#History-master_svg0_2407_13451)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M2,7.99999L2,3C2,2.447715,2.447715,2,3,2C3.55228,2,4,2.447715,4,3L4,5.58578L4.55289,5.03289Q7.67314,2.0162632,11.99624,2Q16.1421,1.99999284744,19.0711,4.928929999999999Q22,7.85786,22,11.99999Q22,16.1421,19.0711,19.0711Q16.1421,22,12,22Q7.85786,22,4.928929999999999,19.0711Q2.000405312,16.1425,2,12.0011L2,11.99999C2,11.44771,2.447715,10.99999,3,10.99999C3.55229,10.99999,4,11.44771,4,11.99999Q4,15.3137,6.34315,17.6568Q8.68629,20,12,20Q15.3137,20,17.6569,17.6568Q20,15.3137,20,11.99999Q20,8.68629,17.6569,6.34314Q15.3137,3.99999,12.0038,3.99999Q8.484960000000001,4.0132200000000005,5.96711,6.4471L5.414210000000001,7L8,7C8.55228,7,9,7.44772,9,8C9,8.55228,8.55228,9,8,9L3,8.99999C2.861928,8.99999,2.730392,8.972010000000001,2.610753,8.92141C2.477211,8.864930000000001,2.358492,8.78026,2.262053,8.67487C2.0992982,8.497,2,8.26009,2,7.99999ZM11,7C11,6.44772,11.44771,6,12,6C12.5523,6,13,6.44772,13,7L13,11.38197L16.447200000000002,13.1056C16.786,13.275,17,13.6212,17,14C17,14.5523,16.552300000000002,15,16,15C15.8448,15,15.6916,14.9639,15.5528,14.8944L11.55279,12.8944C11.214,12.725,11,12.3788,11,12L11,7Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default History;