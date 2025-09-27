import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function CapabilityOpenPlatform(props: IconProps): React.ReactElement {
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
    id: "CapabilityOpenPlatform-master_svg0_1_0206"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 48,
    height: 48,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#CapabilityOpenPlatform-master_svg0_1_0206)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M23 38.12v1.3a3 3 0 0 0-1.312.916L13 35.752l-.271.489L12 37.552l1.326.702 7.675 4.062A3 3 0 0 0 27 42.248v-.027l9.746-5.469-.268-.486-.724-1.314-1.306.738-8.164 4.613A3 3 0 0 0 25 39.42V28.64a4.5 4.5 0 0 0 3.416-5.256l8.564-5.479 1.484-.95a3 3 0 0 0 1.036.625v11.172h2V17.58q.225-.08.43-.19a3 3 0 1 0-3.113-5.121l-8.532-5.143L29 6.352l-.752 1.298-.348.602 9.709 5.699a3 3 0 0 0-.078 1.228l-1.294.827-8.647 5.532a4.5 4.5 0 0 0-7.18 0l-8.659-5.54-1.282-.82a3 3 0 0 0-.08-1.232l8.32-4.929L20 8.252l-.816-1.26-.284-.44-9.693 5.733A3 3 0 1 0 6.5 17.58v11.172h2V17.58a3 3 0 0 0 1.036-.624l1.465.937 8.583 5.49A4.503 4.503 0 0 0 23 28.64zM11 19.673l7 4.478v.101q0 2.1 1.31 3.742.915 1.147 2.19 1.72v7.6l-9-5.196A3 3 0 0 1 11 29.52zm2.066-4.614 7.122 4.556q.52-.427 1.14-.735 1.262-.628 2.672-.628t2.673.628q.619.308 1.139.735l7.113-4.55-9.435-5.447a3 3 0 0 0-1.136-.38q-.174.014-.354.014-.186 0-.366-.015a3 3 0 0 0-1.144.381zm23.915 4.626-6.982 4.466.001.101q0 2.1-1.31 3.742-.915 1.147-2.19 1.72v7.59l8.98-5.186a3 3 0 0 0 1.5-2.598zM26.5 5.252a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0m16.5 28a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0m-32.7.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"
  })));
}
export default CapabilityOpenPlatform;