import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function ApplicationManagement(props: IconProps): React.ReactElement {
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
    id: "ApplicationManagement-master_svg0_1352_40464"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#ApplicationManagement-master_svg0_1352_40464)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20.496 18.596 13.5 22.594q-.25.144-.5.24v-6.961a4 4 0 1 0-2 0v6.962q-.248-.096-.496-.239L3.5 18.594q-1.498-.865-1.5-2.596V7.997q.002-1.73 1.504-2.597L10.5 1.402Q12 .536 13.496 1.4L20.5 5.402q1.498.865 1.5 2.596v8.001q-.002 1.73-1.5 2.595z",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default ApplicationManagement;