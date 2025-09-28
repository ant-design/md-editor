import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function AlipayBlue(props: IconProps): React.ReactElement {
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
    id: "AlipayBlue-master_svg0_970_25959"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 48,
    height: 48,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#AlipayBlue-master_svg0_970_25959)"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#1578FF",
    d: "M29.985 31.07c-4.077 4.894-8.295 7.886-14.685 7.886-6.392 0-10.606-3.943-10.062-8.7.273-3.124 2.448-8.291 11.83-7.474 4.895.405 7.208 1.358 11.287 2.72 1.088-1.902 1.9-4.078 2.58-6.252H12.987V17.48h8.838v-3.135H11.084v-2.043h10.74v-4.62q.134-.68.95-.68h4.488v5.3h11.42v1.902H27.124v3.127h9.383a33.3 33.3 0 0 1-3.806 9.518c2.313.817 11.693 3.67 14.413 4.488V7.548c0-3.805-3.126-6.798-6.798-6.798H7.55C3.741.75.75 3.876.75 7.548v32.904c0 3.806 3.126 6.798 6.798 6.798h32.904c3.806 0 6.798-3.126 6.798-6.798v-1.635c-2.315-1.084-12.645-5.572-17.265-7.747M7.14 29.846c-.406 1.77.68 5.985 7.475 5.985 4.077 0 8.16-2.58 11.419-6.797-4.623-2.313-8.43-3.399-12.78-3.399-3.804.135-5.707 2.442-6.114 4.21",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default AlipayBlue;