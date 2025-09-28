import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function CloudIde(props: IconProps): React.ReactElement {
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
    id: "CloudIde-master_svg0_1_0558"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 48,
    height: 48,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#CloudIde-master_svg0_1_0558)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M11.59 39.59h23.692v-.014C41.251 39.282 46 34.349 46 28.308c0-6.11-4.858-11.087-10.922-11.277C33.22 11.77 28.204 8 22.308 8 15.412 8 9.72 13.156 8.877 19.822 4.877 21.185 2 24.975 2 29.436c0 5.418 4.244 9.846 9.59 10.138zm8.008-8.097-6.015-2.4L17.68 26.5l1.25-4.25L10.5 27.5V31l11.306 4.875L26.43 21l6.424 2.775L28.18 26.5 26.806 31l8.834-5.6v-3.7l-11.584-4.95z"
  })));
}
export default CloudIde;