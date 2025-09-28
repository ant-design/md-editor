import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function RotateCwSquare(props: IconProps): React.ReactElement {
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
    id: "RotateCwSquare-master_svg0_2529_13747"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#RotateCwSquare-master_svg0_2529_13747)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M12.70711,4.29289L12.70711,4.29289L9.70723,1.293012C9.51957,1.105357,9.26522,1,9,1C8.44772,1,8,1.447715,8,2C8,2.2652200000000002,8.105360000000001,2.51957,8.29289,2.70711L9.58579,4L6,4Q4.75736,4,3.87868,4.87868Q3,5.75736,3,7L3,10C3,10.55228,3.447715,11,4,11C4.55228,11,5,10.55228,5,10L5,7Q5,6.58579,5.29289,6.29289Q5.585789999999999,6,6,6L9.58579,6L8.29327,7.29252C8.105360000000001,7.48043,8,7.73478,8,8C8,8.55228,8.44772,9,9,9C9.26522,9,9.51957,8.894639999999999,9.70711,8.70711L12.70651,5.7077L12.70651,5.7077C12.70928,5.70493,12.71145,5.70274,12.7136,5.70055C12.80626,5.6062,12.87643,5.49805,12.92412,5.38278C12.97432,5.26146,12.99961,5.13226,13,5.003L13,5L13,4.997C12.99919,4.722049999999999,12.88742,4.4732,12.70711,4.29289ZM20.1213,4.87868Q19.2426,4,18,4L16,4C15.4477,4,15,4.44772,15,5C15,5.55228,15.4477,6,16,6L18,6Q18.4142,6,18.7071,6.29289Q19,6.58578,19,7L19,18Q19,18.4142,18.7071,18.7071Q18.4142,19,18,19L6,19Q5.585789999999999,19,5.29289,18.7071Q5,18.4142,5,18L5,14C5,13.4477,4.55228,13,4,13C3.447715,13,3,13.4477,3,14L3,18Q3,19.2426,3.87868,20.1213Q4.75736,21,6,21L18,21Q19.2426,21,20.1213,20.1213Q21,19.2426,21,18L21,7Q21,5.75736,20.1213,4.87868Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default RotateCwSquare;