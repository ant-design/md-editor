import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function JsBlack(props: IconProps): React.ReactElement {
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
    id: "JsBlack-master_svg0_970_26019"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 48,
    height: 48,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#JsBlack-master_svg0_970_26019)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 3v42h42V3zm22.838 32.747c0 4.069-2.429 5.972-5.907 5.972-3.15 0-4.987-1.64-5.906-3.61l3.216-1.968c.59 1.115 1.18 2.034 2.559 2.034 1.313 0 2.1-.525 2.1-2.494V22.294h3.938zm9.384 5.972c-3.675 0-6.038-1.772-7.219-4.003l3.216-1.904c.853 1.379 1.968 2.429 3.872 2.429 1.64 0 2.69-.788 2.69-1.97 0-1.377-1.05-1.837-2.887-2.624l-.985-.394c-2.822-1.181-4.725-2.756-4.725-5.972 0-2.953 2.232-5.184 5.775-5.184 2.494 0 4.332.853 5.578 3.15l-3.084 1.969c-.656-1.182-1.378-1.707-2.56-1.707-1.18 0-1.902.722-1.902 1.707 0 1.18.721 1.64 2.428 2.428l.984.394c3.347 1.443 5.25 2.887 5.25 6.234.066 3.478-2.69 5.447-6.431 5.447",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default JsBlack;