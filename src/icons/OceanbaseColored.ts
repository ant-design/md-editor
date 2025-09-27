import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function OceanbaseColored(props: IconProps): React.ReactElement {
  return /*#__PURE__*/React.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 48 48"
  }, props, {
    style: Object.assign({
      verticalAlign: '-0.125em'
    }, props.style),
    className: ['sofa-icons-icon', props.className].filter(Boolean).join(' '),
    width: "1em",
    height: "1em"
  }), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
    id: "OceanbaseColored-master_svg0_1150_32674"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 48,
    height: 48,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#OceanbaseColored-master_svg0_1150_32674)"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#FFA006",
    d: "M23.414 14.96c-6.652 2.77-14.1 3.78-21.256 3.116Q2 18.06 2 17.905v-4.842q0-.203.197-.183 10.188 1.034 19.61-2.854.225-.091.301.14l1.465 4.456a.28.28 0 0 1-.16.338",
    style: {
      mixBlendMode: "passthrough"
    }
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#0181FE",
    d: "M42.97 29.19a46 46 0 0 0-10.55.833c-3.224.635-7.446 2.149-10.373 2.961Q12.794 35.56 2.16 34.808q-.162-.014-.161-.174l.004-15.069q0-.247.244-.229 9.899.86 18.45-2.05 12.648-4.297 25.079-3.506.21.013.21.223l.004 15.075q0 .191-.198.19-1.412-.03-2.824-.079",
    style: {
      mixBlendMode: "passthrough"
    }
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#07C847",
    d: "M45.875 35.773a40.1 40.1 0 0 0-19.708 2.85q-.225.096-.296-.137l-1.481-4.548a.195.195 0 0 1 .112-.24 46 46 0 0 1 21.324-3.148c.095.009.167.09.165.185L46 35.657a.12.12 0 0 1-.037.086.1.1 0 0 1-.042.024q-.022.008-.046.006",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default OceanbaseColored;