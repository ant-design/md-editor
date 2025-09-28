import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Product(props: IconProps): React.ReactElement {
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
    id: "Product-master_svg0_1199_38681"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Product-master_svg0_1199_38681)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M22 8.179q0-1.058-.663-1.881L18.78 3.119Q17.88 2 16.443 2H7.558Q6.12 2 5.22 3.12L2.663 6.297Q2 7.12 2 8.178V18q0 1.243.879 2.122Q3.757 21 5 21h14q1.243 0 2.121-.878Q22 19.242 22 18zM7.558 4H11v2H5.47l1.309-1.627Q7.079 4 7.558 4M13 6h5.53l-1.309-1.627Q16.921 4 16.442 4H13zm6.985 2H4.015Q4 8.087 4 8.18V18q0 .414.293.707T5 19h14q.414 0 .707-.293T20 18V8.18q0-.092-.015-.179M10 12H6v2h4zm3 3H6v2h7z"
  })));
}
export default Product;