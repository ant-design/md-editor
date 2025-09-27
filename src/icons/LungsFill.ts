import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function LungsFill(props: IconProps): React.ReactElement {
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
    id: "LungsFill-master_svg0_2994_22960"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#LungsFill-master_svg0_2994_22960)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M8.30912,5.68421C9.78787,6.17952,10.45482,7.95664,10.74657,9.91897L6.00852,12.6674L7.05608,14.4905L10.94267,12.2365C10.99065,13.662,10.92801,14.9563,10.92801,15.6842C10.92801,18.8421,9.88045,22,5.69022,22C1.5,22,1.5,22,1.5,17.7895C1.5,9.894739999999999,5.16702,4.6317699999999995,8.30912,5.68421ZM22.4524,17.7895L22.4522,18.2484C22.4465,22,22.2943,22,18.2622,22C14.0719,22,13.0245,18.8421,13.0245,15.6842C13.0245,14.9564,12.9618,13.6626,13.0097,12.2376L16.8951,14.4905L17.9427,12.6674L13.2057,9.920020000000001C13.4973,7.95728,14.1643,6.1796,15.6434,5.68421C18.7854,4.6317699999999995,22.4524,9.894739999999999,22.4524,17.7895ZM13.0231,2L13.0231,11.47368L10.92801,11.47368L10.92801,2L13.0231,2Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default LungsFill;