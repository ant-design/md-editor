import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function SquarePen(props: IconProps): React.ReactElement {
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
    id: "SquarePen-master_svg0_691_14093"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#SquarePen-master_svg0_691_14093)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m17.668 1.918-9.013 9.014q-.543.542-.759 1.278l-.84 2.874q-.249.853.38 1.48.627.629 1.48.38l2.873-.84q.737-.215 1.28-.758l9.013-9.014q.914-.915.914-2.207t-.915-2.206-2.206-.915q-1.292 0-2.207.914M9.816 12.772q.072-.245.253-.425l9.013-9.015q.328-.328.793-.328.464 0 .792.329.328.328.329.792 0 .465-.328.793l-9.013 9.014q-.18.18-.426.252l-1.997.584zM20.5 19v-5.5a1 1 0 0 0-2 0V19q0 .414-.293.707T17.5 20H5q-.414 0-.707-.293T4 19V6.5q0-.414.293-.707T5 5.5h5.5a1 1 0 0 0 0-2H5q-1.243 0-2.121.879Q2 5.257 2 6.5V19q0 1.243.879 2.121Q3.757 22 5 22h12.5q1.243 0 2.121-.879.88-.878.88-2.121"
  })));
}
export default SquarePen;