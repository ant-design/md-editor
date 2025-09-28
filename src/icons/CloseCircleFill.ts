import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function CloseCircleFill(props: IconProps): React.ReactElement {
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
    id: "CloseCircleFill-master_svg0_549_14798"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#CloseCircleFill-master_svg0_549_14798)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 23C5.925 23 1 18.075 1 12S5.925 1 12 1s11 4.925 11 11-4.925 11-11 11m0-12.555L8.89 7.333 7.332 8.889 10.445 12l-3.112 3.11 1.556 1.557L12 13.555l3.11 3.112 1.557-1.556L13.555 12l3.112-3.11-1.556-1.557z",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default CloseCircleFill;