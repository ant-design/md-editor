import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Layers(props: IconProps): React.ReactElement {
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
    id: "Layers-master_svg0_824_18485"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Layers-master_svg0_824_18485)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15.128 3.942q-.215-.33-.575-.49L8.83.847Q8 .468 7.17.847l-5.713 2.6q-.355.156-.572.488t-.216.728q0 .397.216.729.217.332.58.491l5.712 2.604q.83.378 1.66 0l5.719-2.6q.356-.157.572-.489t.216-.728-.216-.728M8.278 2.06l5.726 2.607.007.003-.007.003-5.72 2.6q-.277.127-.554 0l-5.728-2.61.007-.003 5.714-2.6q.277-.126.554 0m-.556 8.54L1.61 7.826a.667.667 0 1 0-.551 1.214l6.113 2.774q.829.378 1.659 0l6.112-2.774a.667.667 0 1 0-.55-1.214L8.276 10.6q-.277.126-.555 0m0 3.333L1.61 11.16a.668.668 0 0 0-.942.607c0 .261.153.499.39.607l6.114 2.773q.829.378 1.659 0l6.112-2.773a.667.667 0 1 0-.55-1.214l-6.115 2.773q-.277.127-.555 0"
  })));
}
export default Layers;