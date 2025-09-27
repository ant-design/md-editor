import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function ListTodo(props: IconProps): React.ReactElement {
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
    id: "ListTodo-master_svg0_2432_16204"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#ListTodo-master_svg0_2432_16204)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 6v4q0 .828.586 1.414T4 12h4q.828 0 1.414-.586T10 10V6q0-.828-.586-1.414T8 4H4q-.828 0-1.414.586T2 6m6 4H4V6h4zm2 5a1 1 0 0 1-.293.707l-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 1 1 1.414-1.414L5 17.586l3.293-3.293A1 1 0 0 1 10 15m3-10h8a1 1 0 1 1 0 2h-8a1 1 0 1 1 0-2m0 6h8a1 1 0 1 1 0 2h-8a1 1 0 1 1 0-2m0 6h8a1 1 0 1 1 0 2h-8a1 1 0 1 1 0-2",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default ListTodo;