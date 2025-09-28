import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function SystemManagement(props: IconProps): React.ReactElement {
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
    id: "SystemManagement-master_svg0_835_19243"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#SystemManagement-master_svg0_835_19243)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9.268 1.422A.53.53 0 0 1 9.79 1h4.422a.53.53 0 0 1 .52.422l.417 2.067a.54.54 0 0 0 .334.393c.734.295 1.42.675 2.042 1.137a.56.56 0 0 0 .507.084l2.065-.69c.238-.08.5.017.628.231l2.203 3.701a.52.52 0 0 1-.113.664l-1.635 1.377a.54.54 0 0 0-.183.484c.052.37.084.746.084 1.13s-.032.76-.084 1.13a.54.54 0 0 0 .183.484l1.635 1.377a.52.52 0 0 1 .113.664l-2.203 3.7a.535.535 0 0 1-.628.232l-2.065-.69a.56.56 0 0 0-.507.084 9.1 9.1 0 0 1-2.042 1.137.54.54 0 0 0-.334.393l-.416 2.067a.53.53 0 0 1-.521.422H9.789a.53.53 0 0 1-.52-.422l-.417-2.067a.54.54 0 0 0-.334-.393 9.1 9.1 0 0 1-2.042-1.137.56.56 0 0 0-.507-.085l-2.065.69a.535.535 0 0 1-.628-.23l-2.203-3.701a.52.52 0 0 1 .113-.664l1.635-1.377a.54.54 0 0 0 .183-.484A8 8 0 0 1 2.92 12c0-.384.032-.76.084-1.13a.54.54 0 0 0-.183-.484L1.186 9.009a.52.52 0 0 1-.113-.664l2.203-3.7a.534.534 0 0 1 .628-.232l2.065.69a.56.56 0 0 0 .507-.084 9.1 9.1 0 0 1 2.042-1.137.54.54 0 0 0 .334-.393zM12 15.316c1.857 0 3.361-1.485 3.361-3.316S13.857 8.684 12 8.684 8.638 10.17 8.638 12s1.505 3.316 3.362 3.316"
  })));
}
export default SystemManagement;