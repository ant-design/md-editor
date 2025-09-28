import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Refresh(props: IconProps): React.ReactElement {
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
    id: "Refresh-master_svg0_2197_13383"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Refresh-master_svg0_2197_13383)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 1.002a1 1 0 0 0-.998.998H11v4h.002a.998.998 0 0 0 1.995 0H13V2h-.003A1 1 0 0 0 12 1.002M20.098 4.9a1 1 0 0 1-.292.705l.001.002-2.9 2.9-.001-.002a.997.997 0 1 1-1.41-1.41l-.003-.002 2.9-2.9.002.002a.997.997 0 0 1 1.703.705M22 13h-4v-.002a.998.998 0 0 1 0-1.995V11h4v.003a.998.998 0 0 1 0 1.995zm-6.797 3.2c0 .265.105.518.292.705l-.002.002 2.9 2.9.002-.002a.997.997 0 0 0 1.41-1.41l.002-.002-2.9-2.9-.001.002a.997.997 0 0 0-1.703.705M12 17.002a1 1 0 0 0-.998.998H11v4h.002a.998.998 0 0 0 1.995 0H13v-4h-.003a1 1 0 0 0-.997-.998M8.797 16.2a1 1 0 0 1-.292.705l.002.002-2.9 2.9-.002-.002a.998.998 0 0 1-1.41-1.41l-.002-.002 2.9-2.9.002.002a.997.997 0 0 1 1.702.705M6 13H2v-.002a.998.998 0 0 1 0-1.995V11h4v.003a.998.998 0 0 1 0 1.995zM3.902 4.9c0 .265.105.518.293.705l-.002.002 2.9 2.9.002-.002a.997.997 0 1 0 1.41-1.41l.002-.002-2.9-2.9-.002.002a.998.998 0 0 0-1.703.705",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default Refresh;