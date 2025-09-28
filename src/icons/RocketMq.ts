import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function RocketMq(props: IconProps): React.ReactElement {
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
    id: "RocketMq-master_svg0_1_0278"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 48,
    height: 48,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#RocketMq-master_svg0_1_0278)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7.185 38.128 11.4 36.73h25.2l4.215 1.4a.9.9 0 0 0 1.185-.85v-3.47c0-.428-.154-.841-.433-1.166L36.6 26.876V18.95a8.94 8.94 0 0 0-3.317-6.946l-8.146-6.603a1.806 1.806 0 0 0-2.274 0l-8.146 6.603A8.94 8.94 0 0 0 11.4 18.95v7.925l-4.967 5.767c-.28.325-.433.738-.433 1.166v3.47a.9.9 0 0 0 1.185.85M20.23 16.85c0 1.1-.896 1.99-2 1.99s-2-.89-2-1.99.895-1.99 2-1.99 2 .89 2 1.99m7.151 1.052c-.244.32-.409.692-.466 1.083-.095.648-.39 1.017-.912 1.344-.672.43-1.538.287-2.238-.096a4.3 4.3 0 0 0-2.053-.524c-2.355 0-4.264 1.9-4.264 4.245 0 2.344 1.91 4.244 4.264 4.244.555 0 1.1-.107 1.606-.312.813-.329 1.758-.484 2.521-.052.651.368.992 1.124 1.348 1.782a2.43 2.43 0 0 0 1.861 1.257 2.434 2.434 0 0 0 2.704-2.126 2.42 2.42 0 0 0-.503-1.78 2.44 2.44 0 0 0-2.755-.78c-.578.21-1.25.348-1.787.045-.611-.345-.837-1.1-.758-1.798q.028-.24.028-.48v-.027c-.005-.77.244-1.575.892-1.99.592-.378 1.359-.288 2.053-.173a2.45 2.45 0 0 0 2.338-.925c.39-.509.56-1.151.477-1.786a2.434 2.434 0 0 0-2.735-2.087 2.44 2.44 0 0 0-1.62.936M20.23 31.15c0 1.1-.895 1.99-2 1.99s-2-.89-2-1.99.896-1.99 2-1.99 2 .89 2 1.99M13.2 43v-3.583h21.6V43z"
  })));
}
export default RocketMq;