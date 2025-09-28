import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Rocket(props: IconProps): React.ReactElement {
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
    id: "Rocket-master_svg0_1308_37678"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Rocket-master_svg0_1308_37678)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8.586 13 11 15.414V20a1 1 0 0 0 1.179.984q3.447-.626 4.653-2.43 1.22-1.828.33-5.148 3.242-2.377 4.714-5.804Q23 4.987 23 2a1 1 0 0 0-.994-1q-3.61-.022-6.775 1.718-2.808 1.544-4.628 4.123-3.326-.894-5.158.327-1.803 1.206-2.429 4.653A1 1 0 0 0 4 13zm-.261-2q.513-1.222 1.163-2.375-1.983-.426-2.933.207Q5.73 9.384 5.257 11zm12.638-7.964q-.417 5.705-5.506 9.124l-.005.004q-1.536.97-3.21 1.664l-2.067-2.068q.696-1.655 1.667-3.17 1.645-2.63 4.353-4.12 2.252-1.238 4.768-1.434M13 15.68q1.223-.507 2.379-1.148.42 1.969-.211 2.914-.552.825-2.168 1.298zm-3.983 2.32q-.03-1.257-.904-2.12l-.013-.012q-.88-.84-2.097-.878t-2.147.746q-1.796 1.509-2.347 5.633a1 1 0 0 0 1.124 1.123q4.124-.551 5.633-2.348.78-.923.751-2.144m-2.304-.692q-.325-.306-.772-.32-.451-.013-.797.278-.94.79-1.42 3.011 2.22-.479 3.01-1.42.295-.348.284-.81-.01-.444-.305-.739",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default Rocket;