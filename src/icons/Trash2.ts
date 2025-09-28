import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Trash2(props: IconProps): React.ReactElement {
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
    id: "Trash2-master_svg0_308_02283"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Trash2-master_svg0_308_02283)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 2.667q0-.224-.221-.446Q9.557 2 9.333 2H6.667q-.224 0-.446.221Q6 2.443 6 2.667v.666h4zm1.333.666v-.666q0-.777-.612-1.388Q10.11.667 9.333.667H6.667q-.777 0-1.388.612-.612.611-.612 1.388v.666H2a.667.667 0 1 0 0 1.334h.667v8.666q0 .776.612 1.388.611.612 1.388.612h6.666q.776 0 1.388-.612t.612-1.388V4.667H14a.667.667 0 0 0 0-1.334zm-.666 1.334H4v8.666q0 .224.221.446.222.22.446.22h6.666q.224 0 .446-.22.221-.222.221-.446V4.667zm-3.334 6.666v-4a.667.667 0 0 0-1.333 0v4a.667.667 0 1 0 1.333 0m2.667 0v-4a.667.667 0 0 0-1.333 0v4a.667.667 0 0 0 1.333 0",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default Trash2;