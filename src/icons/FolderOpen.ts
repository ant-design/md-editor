import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function FolderOpen(props: IconProps): React.ReactElement {
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
    id: "FolderOpen-master_svg0_1352_39954"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#FolderOpen-master_svg0_1352_39954)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M22.374 10.16Q21.8 9.424 21 9.155V8q0-1.243-.879-2.121Q19.243 5 18 5h-5.93q-.538 0-.835-.45l-.816-1.21Q9.526 1.985 7.89 2H4q-1.243 0-2.121.879Q1 3.757 1 5v13q0 1.243.879 2.121Q2.757 21 4 21h14.45q2.333.016 2.918-2.25l1.54-6.001q.368-1.425-.534-2.588M19 8v1H9.217q-1.8.042-2.61 1.65l-1.495 2.89a1 1 0 1 0 1.776.92l1.505-2.91q.268-.532.86-.55h10.749q.49 0 .792.387.3.388.177.864l-1.54 6q-.194.754-.981.749H4q-1 0-1-1V5q0-1 1-1h3.91q.545-.005.851.46l.804 1.19Q10.455 7 12.07 7H18q.414 0 .707.293T19 8",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default FolderOpen;