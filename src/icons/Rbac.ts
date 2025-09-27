import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Rbac(props: IconProps): React.ReactElement {
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
    id: "Rbac-master_svg0_835_18520"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Rbac-master_svg0_835_18520)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m21.436 6.104-8.89-4.962a1.12 1.12 0 0 0-1.091 0l-8.89 4.962c-.35.194-.565.56-.565.955v9.882c0 .396.216.76.564.955l8.89 4.962a1.12 1.12 0 0 0 1.091 0l8.89-4.962c.35-.194.565-.56.565-.955V7.059c0-.395-.216-.76-.564-.955M14.365 7.16c0 .965-.617 1.825-1.537 2.144v9.806h-1.664v-9.86A2.27 2.27 0 0 1 9.77 7.16c0-1.255 1.029-2.272 2.297-2.272 1.27 0 2.298 1.017 2.298 2.272m-8.167 9.456v-1.344a2.27 2.27 0 0 1-1.461-2.117c0-.936.58-1.776 1.461-2.116V7.952h1.664v3.085a2.27 2.27 0 0 1 1.47 2.12c0 .938-.584 1.78-1.47 2.119v1.34zm9.932 0v-2.48a2.27 2.27 0 0 1-1.461-2.117c0-.935.58-1.776 1.46-2.116V7.952h1.665V9.9a2.27 2.27 0 0 1 1.469 2.12c0 .938-.584 1.78-1.47 2.119v2.477z"
  })));
}
export default Rbac;