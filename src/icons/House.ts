import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function House(props: IconProps): React.ReactElement {
  return /*#__PURE__*/React.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 16 16",
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
    id: "House-master_svg0_824_18496"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#House-master_svg0_824_18496)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1.333 6.667v6q0 .828.586 1.414t1.414.586h9.334q.828 0 1.414-.586t.586-1.414v-6q0-.93-.706-1.525l-4.67-4.003Q8.731.667 8 .667q-.732 0-1.295.475L2.042 5.14q-.709.6-.709 1.528m9.334 6.666h2q.276 0 .471-.195t.195-.471v-6q0-.31-.24-.513L8.43 2.158Q8.244 2 8 2t-.427.155l-4.67 4.002q-.236.2-.236.51v6q0 .276.195.471t.471.195h2V8.667q0-.553.39-.943.391-.39.944-.39h2.666q.553 0 .943.39t.39.943zm-4 0h2.666V8.667H6.667z"
  })));
}
export default House;