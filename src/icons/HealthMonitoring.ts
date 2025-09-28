import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function HealthMonitoring(props: IconProps): React.ReactElement {
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
    id: "HealthMonitoring-master_svg0_549_14782"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#HealthMonitoring-master_svg0_549_14782)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M14.667 8A6.667 6.667 0 1 1 1.334 8a6.667 6.667 0 0 1 13.333 0M8 2.667A5.333 5.333 0 0 0 2.667 8H5.44a3.4 3.4 0 0 0-.108.722c0 1.473 1.226 2.611 2.667 2.611s2.667-1.138 2.667-2.611c0-.19-.042-.44-.108-.722h2.774A5.333 5.333 0 0 0 8 2.667M6.42 8.209c-.054.23-.078.383-.085.47l-.002.045c0 .889.747 1.61 1.667 1.61s1.667-.721 1.667-1.61v-.007l-.002-.038a3 3 0 0 0-.085-.47 14 14 0 0 0-.268-.944 46 46 0 0 0-.844-2.384l-.161-.42a.328.328 0 0 0-.613 0l-.162.42c-.31.816-.616 1.664-.844 2.384-.114.361-.206.681-.268.944",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default HealthMonitoring;