import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Cluster(props: IconProps): React.ReactElement {
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
    id: "Cluster-master_svg0_745_10841"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Cluster-master_svg0_745_10841)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15.066 10.356q.267-.453.267-.89V5.134q0-.245-.072-.486a.66.66 0 0 0-.12-.305l-.062-.114q-.219-.383-.546-.628l-.049-.034-4.2-2.6-.021-.012Q9.846.717 9.367.717T8.47.954L1.634 4.936q-.413.183-.685.6-.034.054-.064.108a.66.66 0 0 0-.146.339q-.072.234-.072.484v4.4q0 .414.248.869.23.423.552.664l.049.033 4.2 2.6.021.013q.417.237.896.237t.896-.237l6.873-4.003q.4-.24.664-.687M2 7.223v3.644q0 .074.085.23.084.153.165.223L6 13.64V9.704zm.509-1.253 4.17 2.586 6.884-3.992-3.968-2.456q-.233-.127-.466.005zM14 5.852l-1.333.773v3.886l1.064-.62q.094-.057.187-.213.082-.14.082-.211zm-2.667 5.435V7.398L10 8.171v3.893zm-2.666 1.554V8.944l-1.334.773v3.9z"
  })));
}
export default Cluster;