import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function MatlabColored(props: IconProps): React.ReactElement {
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
    id: "MatlabColored-master_svg0_970_26871"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 48,
    height: 48,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#MatlabColored-master_svg0_970_26871)"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#4DB6AC",
    d: "M11.952 21.672 0 26.064l9.24 6.528 7.368-7.296z",
    style: {
      mixBlendMode: "passthrough"
    }
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#00897B",
    d: "M32.568 1.992c-1.008.144-.72.072-2.16 1.224-1.368 1.104-5.328 7.632-7.44 9.84-1.872 1.968-2.616.936-4.584 2.568q-1.944 1.632-4.968 4.896l4.872 3.6 7.728-10.608c1.824-2.496 1.8-2.832 2.808-5.472.48-1.296 1.344-2.28 2.112-3.48.936-1.512 2.28-2.664 1.632-2.568",
    style: {
      mixBlendMode: "passthrough"
    }
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#FFB74D",
    d: "M32.424 1.872c-2.376-.024-4.728 10.44-8.808 18.48q-4.152 8.184-12.336 13.44c1.392.624 2.64.384 4.128 1.776 1.008 1.224 3.96 7.296 5.712 11.112q1.44-.792 3.264-2.112c1.824-1.32 4.032-3.192 5.592-5.352 2.04-2.88 3.648-4.656 4.992-5.736s2.472-1.464 3.528-1.56q3.816-.336 9.48 6.528Q36.144 1.896 32.424 1.872",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default MatlabColored;