import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Copy(props: IconProps): React.ReactElement {
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
    id: "Copy-master_svg0_388_03608"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Copy-master_svg0_388_03608)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9.804 2.196q.196.197.196.47a.667.667 0 0 0 1.333 0q0-.825-.587-1.412Q10.16.667 9.333.667H2.667q-.826 0-1.413.587T.667 2.667v6.666q0 .826.587 1.413t1.413.587a.667.667 0 0 0 0-1.333q-.274 0-.47-.196Q2 9.607 2 9.334V2.666q0-.274.196-.47Q2.393 2 2.666 2h6.667q.274 0 .47.196M5.253 14.748q-.586-.586-.586-1.415V6.667q0-.829.586-1.415.585-.585 1.414-.585h6.666q.829 0 1.415.585.585.586.585 1.415v6.666q0 .829-.585 1.415-.586.585-1.415.585H6.667q-.829 0-1.414-.585M6 13.333q0 .276.195.472.196.195.472.195h6.666q.277 0 .472-.195.195-.196.195-.472V6.667q0-.276-.195-.472T13.333 6H6.667q-.276 0-.472.195Q6 6.391 6 6.667z"
  })));
}
export default Copy;