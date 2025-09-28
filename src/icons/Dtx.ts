import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Dtx(props: IconProps): React.ReactElement {
  return /*#__PURE__*/React.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 48 48",
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
    id: "Dtx-master_svg0_525_21709"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 48,
    height: 48,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Dtx-master_svg0_525_21709)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M33.026 9.211a1 1 0 0 1 .5.866v9.846a1 1 0 0 1-.5.866l-8.012 4.626-.514.296a1 1 0 0 1-1 0l-.514-.297-2.816-1.625 3.21-5.549 1.518.912a1 1 0 0 0 1.372-.343l2.058-3.43a1 1 0 0 0-.343-1.372l-5.144-3.087a1 1 0 0 0-1.372.343l-2.059 3.43a1 1 0 0 0 .343 1.371l1.287.773-3.232 5.588-2.834-1.636a1 1 0 0 1-.5-.866v-9.846a1 1 0 0 1 .5-.866L23.5 4.29a1 1 0 0 1 1 0zm-14.968 15.42-1.143-.66.893-1.546 2.362 1.364-.894 1.546zm4.968 9.869v3.423a1 1 0 0 1-.5.866l-.401.232L14 43.71a1 1 0 0 1-1 0L4.474 38.79a1 1 0 0 1-.5-.866v-9.846a1 1 0 0 1 .5-.866l8.012-4.626.514-.296a1 1 0 0 1 1 0l4.058 2.343 1.218.703 2.849 1.644.401.232a1 1 0 0 1 .5.866V31.5H16V30a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1.5zm1.947 0h-1.947v-3h1.947zm6.085-10.513L34 22.289a1 1 0 0 1 1 0l.514.297 8.012 4.625a1 1 0 0 1 .5.866v9.846a1 1 0 0 1-.5.866L35 43.71a1 1 0 0 1-1 0l-8.125-4.69-.402-.232a1 1 0 0 1-.5-.866V34.5H25v-3h-.027v-3.423a1 1 0 0 1 .5-.866l.402-.232 2.822-1.629 3.263 5.646-1.6.927a1 1 0 0 0-.363 1.366L32 36.751a1 1 0 0 0 1.367.364l5.192-3.007a1 1 0 0 0 .364-1.367L36.92 29.28a1 1 0 0 0-1.366-.364l-1.233.714zm0 0-2.361 1.363-.885-1.53 2.36-1.366z"
  })));
}
export default Dtx;