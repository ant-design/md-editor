import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function ClockAlert(props: IconProps): React.ReactElement {
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
    id: "ClockAlert-master_svg0_740_13542"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#ClockAlert-master_svg0_740_13542)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M13.4 5.386q-.527-1.09-1.426-1.884-.869-.768-1.967-1.158t-2.256-.343q-1.199.049-2.295.562-1.096.512-1.902 1.4-.78.86-1.183 1.953-.405 1.093-.372 2.252.033 1.199.532 2.302t1.377 1.92q.849.79 1.936 1.208 1.088.418 2.247.4 1.199-.018 2.307-.502h.002a.667.667 0 1 1 .534 1.222h-.002q-1.354.591-2.82.614-1.418.021-2.746-.49-1.329-.51-2.366-1.476-1.075-1-1.684-2.347-.61-1.347-.65-2.814-.04-1.417.454-2.752t1.446-2.385q.986-1.087 2.325-1.713T7.697.669q1.416-.058 2.757.419 1.341.476 2.403 1.415 1.1.972 1.743 2.303a.666.666 0 1 1-1.2.58M8 3.333A.667.667 0 0 0 7.333 4v4c0 .253.143.483.369.596l2.667 1.334a.667.667 0 1 0 .596-1.193L8.667 7.588V4A.667.667 0 0 0 8 3.333m4.667 4.334a.667.667 0 0 1 1.333 0v4a.667.667 0 0 1-1.333 0zM13.333 15a.667.667 0 1 0 0-1.333.667.667 0 0 0 0 1.333"
  })));
}
export default ClockAlert;