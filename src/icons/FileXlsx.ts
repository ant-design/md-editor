import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function FileXlsx(props: IconProps): React.ReactElement {
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
    fill: "#22B35E",
    fillRule: "evenodd",
    d: "M8 2h7l5 5v11c0 1.4-.003 2.116-.279 2.649a2.5 2.5 0 0 1-1.072 1.072C18.116 21.997 17.4 22 16 22H8c-1.4 0-2.116-.003-2.649-.279a2.5 2.5 0 0 1-1.072-1.072C4.003 20.116 4 19.4 4 18V6c0-1.4.003-2.116.279-2.649A2.5 2.5 0 0 1 5.351 2.28C5.884 2.003 6.6 2 8 2m5.93 6.156-1.633 2.728-1.649-2.73A.32.32 0 0 0 10.375 8H9.35a.32.32 0 0 0-.271.49l2.196 3.479-2.226 3.54A.32.32 0 0 0 9.32 16h.92a.32.32 0 0 0 .271-.152l1.673-2.706 1.66 2.706a.32.32 0 0 0 .274.152h1a.32.32 0 0 0 .268-.493l-2.235-3.481 2.274-3.533A.32.32 0 0 0 15.156 8h-.952a.32.32 0 0 0-.274.156"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#D9F7BE",
    fillRule: "evenodd",
    d: "m15 2 5 5h-3c-.7 0-1.058-.001-1.324-.14a1.26 1.26 0 0 1-.536-.536C15 6.058 15 5.7 15 5z"
  }));
}
export default FileXlsx;