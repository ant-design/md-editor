import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Gateway(props: IconProps): React.ReactElement {
  return /*#__PURE__*/React.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 48 48",
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
    id: "Gateway-master_svg0_1_0153"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 48,
    height: 48,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Gateway-master_svg0_1_0153)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M28 8.514a4 4 0 1 0-4.793 3.92v1.74c-.43.087-.843.244-1.222.465l-9.141 5.33a4 4 0 0 0-1.985 3.456v10.73a4 4 0 0 0 .164 1.134l-1.09.632a4 4 0 1 0 .523 1.43l1.255-.727a4 4 0 0 0 1.133.987l9.141 5.33a4 4 0 0 0 4.03 0l9.141-5.33a4 4 0 0 0 1.105-.952l1.288.746a4 4 0 1 0 .506-1.44l-1.09-.633a4 4 0 0 0 .176-1.177v-10.73a4 4 0 0 0-1.985-3.456l-9.141-5.33a4 4 0 0 0-1.308-.482v-1.706A4 4 0 0 0 28 8.514m-4.793 7.741q-.107.05-.214.112l-9.142 5.33q-.992.579-.992 1.728v10.799l2.075-1.203a2 2 0 0 0 .63 1.369l-2.096 1.215q.168.153.383.278l9.142 5.33q1.007.588 2.015 0l9.14-5.33q.194-.113.35-.247l-2.096-1.215a2 2 0 0 0 .662-1.35l2.075 1.203q.002-.059.002-.119v-10.73q0-1.15-.992-1.728l-9.141-5.33q-.151-.088-.301-.15v2.443a2 2 0 0 0-1.5.035zm1.5 2.405v9.546l.015.027 8.342 4.837q.005-.07.005-.14v-8.277a2 2 0 0 0-.993-1.728l-7.068-4.122a2 2 0 0 0-.301-.143m7.695 15.76-8.446-4.897-8.392 4.867q.165.154.36.268l7.069 4.122a2 2 0 0 0 2.015 0l7.068-4.122a2 2 0 0 0 .326-.237m-9.195-15.725a2 2 0 0 0-.214.108l-7.068 4.122a2 2 0 0 0-.993 1.728v8.278q0 .045.002.09l8.273-4.797z"
  })));
}
export default Gateway;