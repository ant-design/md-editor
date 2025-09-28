import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function ClockArrowUp(props: IconProps): React.ReactElement {
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
    id: "ClockArrowUp-master_svg0_1308_37685"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#ClockArrowUp-master_svg0_1308_37685)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18.412 5.685q2.713 2.755 2.582 6.62v.033a1 1 0 0 0 2 .034q.159-4.723-3.157-8.09-3.317-3.367-8.042-3.28T3.882 4.579t-2.855 8.201 3.984 7.717q3.65 3.002 8.34 2.421a1 1 0 1 0-.246-1.984q-3.837.474-6.823-1.982t-3.26-6.313 2.336-6.71q2.609-2.854 6.475-2.926t6.579 2.683M12 5a1 1 0 0 0-1 1v6a1 1 0 0 0 .553.894l1.562.781a1 1 0 0 0 .894-1.788L13 11.382V6a1 1 0 0 0-1-1m9.293 13.707L19 16.414V22a1 1 0 1 1-2 0v-5.586l-2.293 2.293a1 1 0 1 1-1.414-1.414l4-4 .009-.009a.997.997 0 0 1 1.396 0l.01.009 4 4a1 1 0 1 1-1.415 1.414",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default ClockArrowUp;