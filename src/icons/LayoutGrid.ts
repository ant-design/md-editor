import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function LayoutGrid(props: IconProps): React.ReactElement {
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
    id: "LayoutGrid-master_svg0_2790_14326"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#LayoutGrid-master_svg0_2790_14326)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M2,9L2,4Q2,3.17157,2.585786,2.585786Q3.17157,2,4,2L9,2Q9.82843,2,10.41421,2.585787Q11,3.17157,11,4L11,9Q11,9.82843,10.41421,10.41421Q9.82843,11,9,11L4,11Q3.17157,11,2.585787,10.41421Q1.999999880791,9.82843,2,9ZM4,9L9,9L9,4L4,4L4,9ZM13,9L13,4Q13,3.17157,13.5858,2.585786Q14.1716,2,15,2L20,2Q20.8284,2,21.4142,2.585787Q22,3.17157,22,4L22,9Q22,9.82843,21.4142,10.41421Q20.8284,11,20,11L15,11Q14.1716,11,13.5858,10.41421Q13,9.82843,13,9ZM15,9L20,9L20,4L15,4L15,9ZM13,20L13,15Q13,14.1716,13.5858,13.5858Q14.1716,13,15,13L20,13Q20.8284,13,21.4142,13.5858Q22,14.1716,22,15L22,20Q22,20.8284,21.4142,21.4142Q20.8284,22,20,22L15,22Q14.1716,22,13.5858,21.4142Q13,20.8284,13,20ZM15,20L20,20L20,15L15,15L15,20ZM2,20L2,15Q2,14.1716,2.585786,13.5858Q3.17157,13,4,13L9,13Q9.82843,13,10.41421,13.5858Q11,14.1716,11,15L11,20Q11,20.8284,10.41421,21.4142Q9.82843,22,9,22L4,22Q3.17157,22,2.585787,21.4142Q1.999999880791,20.8284,2,20ZM4,20L9,20L9,15L4,15L4,20Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default LayoutGrid;