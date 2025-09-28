import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function PythonColored(props: IconProps): React.ReactElement {
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
    id: "PythonColored-master_svg0_970_25943"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 48,
    height: 48,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#PythonColored-master_svg0_970_25943)"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#0075AA",
    d: "M17.186 23.233c.419-.07.837-.117 1.256-.117h-.349H29.42c.488 0 .953-.07 1.418-.186 2.093-.581 3.628-2.442 3.628-4.744V8.674c0-2.697-2.302-4.744-5.046-5.186-1.744-.279-4.28-.418-6-.418-1.721 0-3.372.162-4.837.418-4.28.744-5.047 2.303-5.047 5.186v3.117H24v1.744H10.14c-3.884 0-7.047 4.651-7.07 10.372V24c0 1.047.093 2.047.302 2.977.86 4.325 3.558 7.488 6.768 7.488h1.65v-5c0-2.93 2.187-5.651 5.396-6.232M18.302 9.93c-1.046 0-1.907-.86-1.883-1.907 0-1.046.837-1.907 1.883-1.907s1.907.86 1.907 1.907c-.023 1.07-.86 1.907-1.907 1.907",
    style: {
      mixBlendMode: "passthrough"
    }
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#FFD400",
    d: "M44.489 20.349c-1-3.977-3.582-6.814-6.628-6.814H36.21v4.442c0 3.697-2.419 6.372-5.396 6.837q-.453.07-.907.07H18.582c-.489 0-.954.07-1.419.186-2.093.558-3.628 2.279-3.628 4.535v9.511c0 2.698 2.721 4.303 5.396 5.07 3.186.93 6.674 1.093 10.511 0 2.535-.72 5.023-2.186 5.023-5.07v-2.883H24v-1.768h13.86c2.745 0 5.14-2.325 6.303-5.72A14.6 14.6 0 0 0 44.931 24c0-1.279-.163-2.512-.442-3.651M29.65 37.814c1.047 0 1.884.86 1.884 1.907s-.86 1.907-1.884 1.907a1.916 1.916 0 0 1-1.907-1.907c.024-1.046.861-1.907 1.907-1.907",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default PythonColored;