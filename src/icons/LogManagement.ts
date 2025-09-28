import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function LogManagement(props: IconProps): React.ReactElement {
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
    id: "LogManagement-master_svg0_232_39347"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#LogManagement-master_svg0_232_39347)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 1a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2zM3 4v17a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-1v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V2H5a2 2 0 0 0-2 2m5.388 9.918L7.5 13.16l1.068-1.82 1.11.377a3.7 3.7 0 0 1 1.029-.581L10.932 10h2.136l.225 1.136c.376.14.724.334 1.029.58l1.11-.376 1.068 1.82-.888.758c.031.19.052.383.052.582s-.02.392-.052.582l.888.758-1.068 1.82-1.11-.377a3.7 3.7 0 0 1-1.029.581L13.068 19h-2.136l-.225-1.136a3.7 3.7 0 0 1-1.029-.58l-1.11.376L7.5 15.84l.888-.758a3.6 3.6 0 0 1-.052-.582q.002-.298.052-.582m3.684 2.255a1.688 1.688 0 1 0 0-3.375 1.688 1.688 0 0 0 0 3.375",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default LogManagement;