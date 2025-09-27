import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function FileOther(props: IconProps): React.ReactElement {
  return /*#__PURE__*/React.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24"
  }, props, {
    style: Object.assign({
      verticalAlign: '-0.125em'
    }, props.style),
    className: ['sofa-icons-icon', props.className].filter(Boolean).join(' '),
    width: "1em",
    height: "1em"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#8C8C8C",
    fillRule: "evenodd",
    d: "M15 2H8c-1.4 0-2.116.003-2.649.279A2.5 2.5 0 0 0 4.28 3.351C4.003 3.884 4 4.6 4 6v12c0 1.4.003 2.116.279 2.649.238.459.613.834 1.072 1.072C5.884 21.997 6.6 22 8 22h8c1.4 0 2.116-.003 2.649-.279a2.5 2.5 0 0 0 1.072-1.072C19.997 20.116 20 19.4 20 18V7zM8.352 9.426h7.546v1.593H8.352zm5.59 3.555h-5.59v1.593h5.59z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#DBDBDB",
    fillRule: "evenodd",
    d: "m15 2 5 5h-3c-.7 0-1.058-.001-1.324-.14a1.26 1.26 0 0 1-.536-.536C15 6.058 15 5.7 15 5z"
  }));
}
export default FileOther;