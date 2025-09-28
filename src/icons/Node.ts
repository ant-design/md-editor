import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Node(props: IconProps): React.ReactElement {
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
    id: "Node-master_svg0_691_14144"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Node-master_svg0_691_14144)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M14.398 11.666q.268-.463.269-.999V5.333q0-.536-.269-1-.268-.463-.731-.73L8.997.935Q8.536.668 8 .668T7 .936L2.336 3.601q-.466.27-.734.733t-.269.999v5.334q0 .536.269 1 .268.463.731.73l4.67 2.669q.439.253.945.265a1 1 0 0 0 .104 0q.506-.012.948-.267l4.664-2.665q.466-.27.734-.733M8.667 13.72l4.336-2.478q.33-.19.33-.574V9.264l-4.666 2.47zm-1.334 0V8.386L2.667 5.704v4.963q0 .383.333.576zM3.35 4.558 8 7.231l4.651-2.673-4.315-2.466q-.336-.194-.67-.001zm9.984 1.146L8.667 8.386v1.84l4.666-2.47zM4.007 8H4a.667.667 0 0 0 0 1.333h.007c.326 0 .66-.333.66-.666 0-.334-.334-.667-.66-.667"
  })));
}
export default Node;