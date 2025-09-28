import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function CPlusplus(props: IconProps): React.ReactElement {
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
    id: "CPlusplus-master_svg0_970_26015"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 48,
    height: 48,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#CPlusplus-master_svg0_970_26015)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M42.604 13c-.307-.532-.73-.995-1.195-1.265L25.246 2.403c-.931-.537-2.455-.537-3.387 0L5.693 11.735C4.762 12.273 4 13.593 4 14.668v18.664c0 .539.191 1.137.496 1.667.306.531.73.996 1.195 1.264l16.164 9.334c.93.537 2.454.537 3.386 0l16.164-9.334c.466-.268.89-.731 1.195-1.264.305-.532.496-1.128.496-1.667V14.668c.004-.539-.187-1.137-.494-1.667zM23.55 37.036c-7.187 0-13.034-5.847-13.034-13.034s5.847-13.034 13.034-13.034a13.08 13.08 0 0 1 11.253 6.45l.033.06-5.639 3.266a6.55 6.55 0 0 0-5.646-3.261 6.525 6.525 0 0 0-6.516 6.517 6.524 6.524 0 0 0 6.516 6.518 6.55 6.55 0 0 0 5.631-3.229l.017-.03 5.641 3.263c-2.303 3.915-6.493 6.502-11.286 6.512h-.001zm13.034-12.31h-1.448v1.448h-1.448v-1.448H32.24v-1.448h1.448V21.83h1.448v1.448h1.448zm5.43 0h-1.448v1.448h-1.448v-1.448h-1.447v-1.448h1.447V21.83h1.448v1.448h1.448z",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default CPlusplus;