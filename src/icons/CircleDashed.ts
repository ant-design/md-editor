import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function CircleDashed(props: IconProps): React.ReactElement {
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
    id: "CircleDashed-master_svg0_691_14098"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#CircleDashed-master_svg0_691_14098)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9.14 2.11q-1.14-.221-2.28 0A.667.667 0 0 1 6.607.8Q8 .53 9.393.8a.667.667 0 0 1-.253 1.31m0 11.78q-1.14.221-2.28 0a.667.667 0 1 0-.254 1.309q1.394.27 2.787 0a.667.667 0 0 0-.253-1.308m4.946-9.981q-.794-1.182-1.973-1.98a.667.667 0 0 0-.748 1.104q.965.653 1.614 1.62a.667.667 0 0 0 1.107-.744M2.12 6.733a.7.7 0 0 1-.012.127q-.22 1.14 0 2.28A.667.667 0 0 1 .8 9.393Q.53 8 .8 6.607a.667.667 0 0 1 1.321.126m12.065 5.006c0 .134-.04.264-.115.374q-.798 1.179-1.98 1.973a.667.667 0 0 1-.744-1.107q.967-.65 1.62-1.614a.667.667 0 0 1 1.219.374m-.307-5.006q0 .064.012.127.22 1.14 0 2.28a.665.665 0 0 0 .654.793c.32 0 .594-.226.655-.54q.27-1.393 0-2.786a.667.667 0 0 0-1.321.126M4.947 2.467c0 .222-.11.43-.294.554q-.967.65-1.62 1.614a.667.667 0 1 1-1.104-.748q.798-1.179 1.98-1.973a.667.667 0 0 1 1.038.553M1.801 11.72c0 .133.04.262.113.372q.794 1.182 1.972 1.98a.667.667 0 1 0 .749-1.104q-.965-.653-1.614-1.62a.667.667 0 0 0-1.22.372"
  })));
}
export default CircleDashed;