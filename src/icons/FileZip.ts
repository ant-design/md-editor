import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function FileZip(props: IconProps): React.ReactElement {
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
    fill: "#FAB714",
    fillRule: "evenodd",
    d: "M9.5 2H15l5 5v11c0 1.4-.003 2.116-.279 2.649a2.5 2.5 0 0 1-1.072 1.072C18.116 21.997 17.4 22 16 22H8c-1.4 0-2.116-.003-2.649-.279a2.5 2.5 0 0 1-1.072-1.072C4.003 20.116 4 19.4 4 18V6c0-1.4.003-2.116.279-2.649A2.5 2.5 0 0 1 5.351 2.28c.465-.241 1.07-.274 2.15-.278V4H9.5v2h2V4h-2zm0 4h-2v2h2v2h-2v2h2v2h2v-2h-2v-2h2V8h-2z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#FFDE8F",
    fillRule: "evenodd",
    d: "m15 2 5 5h-3c-.7 0-1.058-.001-1.324-.14a1.26 1.26 0 0 1-.536-.536C15 6.058 15 5.7 15 5z"
  }));
}
export default FileZip;