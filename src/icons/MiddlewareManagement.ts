import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function MiddlewareManagement(props: IconProps): React.ReactElement {
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
    id: "MiddlewareManagement-master_svg0_1036_30728"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#MiddlewareManagement-master_svg0_1036_30728)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M22 7.529c0-.735-.4-1.415-1.05-1.782l-7.9-4.471a2.14 2.14 0 0 0-2.1 0l-7.9 4.47A2.05 2.05 0 0 0 2 7.53v8.942c0 .735.4 1.415 1.05 1.782l7.9 4.471c.65.368 1.45.368 2.1 0l4.458-2.523 2.959-1.657q.138-.078.266-.168l.217-.123A2.05 2.05 0 0 0 22 16.471zm-2 3.405V8.699l-7 3.89v7.865l2-1.131v-4.257q0-1.132.971-1.715zm-.35 5.757L17 18.19v-3.125l3-1.8v2.66q0 .485-.35.765M7.016 5.8l-2.04 1.153L12 10.856l7.023-3.902L16.984 5.8l-3.99 2.284q-.462.264-.994.264t-.993-.264zm7.566-.93-2.037-1.324q-.545-.354-1.09 0L9.418 4.871 12 6.348z"
  })));
}
export default MiddlewareManagement;