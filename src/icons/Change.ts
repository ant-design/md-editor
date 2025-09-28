import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Change(props: IconProps): React.ReactElement {
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
    id: "Change-master_svg0_1278_48850"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Change-master_svg0_1278_48850)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M14.303 3.303a2.303 2.303 0 0 1-4.18 1.337q-.548.14-1.078.363-1.362.577-2.414 1.628-.655.655-1.126 1.43-.26-.144-.541-.255-.793-.314-1.645-.317h-.023Q3.99 6.15 5.07 5.069 6.426 3.715 8.185 2.97q.824-.349 1.683-.54a2.303 2.303 0 0 1 4.435.873m1.891 1.66q.317-.8.317-1.66v-.007q1.338.693 2.42 1.774 1.355 1.356 2.099 3.115.349.824.54 1.683a2.303 2.303 0 1 1-2.21.256q-.14-.55-.363-1.08-.577-1.361-1.628-2.413-.655-.655-1.43-1.126.144-.26.255-.541M17.416 12c0 2.955-2.46 5.369-5.416 5.416-2.955-.047-5.416-2.46-5.416-5.416 0-2.955 2.46-5.416 5.416-5.416 2.955 0 5.416 2.46 5.416 5.416M4.639 13.876a2.303 2.303 0 1 0-2.209.256q.191.859.54 1.683.744 1.76 2.1 3.115 1.081 1.081 2.419 1.773v-.022q.003-.852.316-1.645.112-.282.257-.542-.776-.47-1.43-1.125-1.052-1.051-1.629-2.414-.224-.53-.364-1.079m12.73 3.493q.655-.655 1.125-1.43.26.144.542.255.8.317 1.66.317h.007q-.692 1.338-1.773 2.42-1.356 1.355-3.115 2.099-.824.349-1.683.54a2.304 2.304 0 1 1-.256-2.21q.55-.14 1.08-.363 1.362-.577 2.413-1.628"
  })));
}
export default Change;