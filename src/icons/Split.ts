import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Split(props: IconProps): React.ReactElement {
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
    id: "Split-master_svg0_2328_13346"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Split-master_svg0_2328_13346)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 24v5a1 1 0 0 0 2 0v-2.586l6.12 6.121q.894.892.88 2.154V43a1 1 0 1 0 2 0v-8.29q.023-2.102-1.465-3.59L5.415 25H8a1 1 0 0 0 0-2H3a1 1 0 0 0-1 1m20 0v5a1 1 0 1 1-2 0v-2.586l-4.293 4.293a1 1 0 1 1-1.414-1.414L18.586 25H16a1 1 0 1 1 0-2h5a1 1 0 0 1 1 1",
    style: {
      mixBlendMode: "passthrough"
    },
    transform: "matrix(1 0 0 -1 0 46)"
  })));
}
export default Split;