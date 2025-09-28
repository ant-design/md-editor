import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function AppAiMarket(props: IconProps): React.ReactElement {
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
    id: "AppAiMarket-master_svg0_1063_39968"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#AppAiMarket-master_svg0_1063_39968)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4.5 22c-1.657 0-3-1.323-3-2.954v-8.818c0-.954.468-1.849 1.256-2.403l7.5-5.275a3.04 3.04 0 0 1 3.488 0l7.5 5.275a2.94 2.94 0 0 1 1.256 2.403v8.818c0 1.631-1.343 2.954-3 2.954zm2.25-8.861 1.568.571a5.21 5.21 0 0 1 3.102 3.054l.58 1.544.58-1.544a5.21 5.21 0 0 1 3.102-3.054l1.568-.571-1.568-.572a5.21 5.21 0 0 1-3.102-3.053L12 7.97l-.58 1.544a5.21 5.21 0 0 1-3.102 3.053z"
  })));
}
export default AppAiMarket;