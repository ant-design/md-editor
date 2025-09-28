import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function FilePenFill(props: IconProps): React.ReactElement {
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
    id: "FilePenFill-master_svg0_2986_14243"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#FilePenFill-master_svg0_2986_14243)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M3,9C4.33583,9,5.671670000000001,9,7.0075,9C8.664349999999999,9,10,7.65685,10,6L10,2C12.67651,2,15.3534,1.9878156,18.030099999999997,1.99136528C19.6786,1.99355151,21,3.3334,21,4.98194L21,6.75736L12.0012,15.7562L11.995,19.995L16.2414,20.0012L21,15.2426C21,16.4984,21,17.7541,21,19.0099C21,20.6667,19.6569,22,18,22L6,22C4.34315,22,3,20.6344,3,18.9775C3,15.6517,3,12.3258,3,9ZM21.7782,8.80761L23.1924,10.2218L15.4142,18L13.9979,17.9979L14,16.5858L21.7782,8.80761ZM3,7L8,2.00318003L8,5C8,6.10457,7.10457,7,6,7L3,7Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default FilePenFill;