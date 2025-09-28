import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function PiggyBank(props: IconProps): React.ReactElement {
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
    id: "PiggyBank-master_svg0_1036_27192"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#PiggyBank-master_svg0_1036_27192)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 7.106V4.5a1 1 0 0 0-1-1q-1.355 0-2.608.99-.498.395-.825.794-1.227-.36-2.75-.38-2.08-.028-3.947.598-2.125.712-3.384 2.098-1.147 1.263-1.409 2.9H4q-.41 0-.705-.295Q3 9.911 3 9.5v-1a1 1 0 0 0-2 0v1q0 1.24.88 2.12T4 12.5h.027q.064 1.08.28 1.694.428 1.222 1.693 2.288V19.5a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1h1v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-3.41q1.126-.684 1.65-1.59H22a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-1.167q-.241-.713-.833-1.394m-7.123.634q-1.346-.225-2.195-.013-.719.18-1.058.689l-1.248-.832q.66-.991 1.942-1.312 1.151-.288 2.805-.012zM18 9.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default PiggyBank;