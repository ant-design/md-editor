import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function AntChainIcon(props: IconProps): React.ReactElement {
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
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19.026 10h-9.7A7.326 7.326 0 0 0 2 17.326V30.11a7.326 7.326 0 0 0 7.326 7.326h9.7l-2.341-3.311-7.071-2.167a3.06 3.06 0 0 1-2.136-2.936V18.414a3.06 3.06 0 0 1 2.136-2.935l7.07-2.167zm9.948 0h9.7A7.326 7.326 0 0 1 46 17.326V30.11a7.326 7.326 0 0 1-7.326 7.326h-9.7l2.341-3.311 7.071-2.167a3.06 3.06 0 0 0 2.136-2.936V18.414a3.06 3.06 0 0 0-2.136-2.935l-7.07-2.167zm2.356 15.298H16.67v-3.305h14.66z"
  }));
}
export default AntChainIcon;