import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Boxes(props: IconProps): React.ReactElement {
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
    id: "Boxes-master_svg0_642_13337"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Boxes-master_svg0_642_13337)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6.97 1.175Q7.446.89 8 .89q.555 0 1.03.285l2 1.2q.45.27.71.728t.26.984v2.536l2.363 1.419q.45.27.71.727t.26.984v2.162q0 .525-.26.982t-.71.728l-2 1.2q-.442.266-.954.284a.7.7 0 0 1-.152 0q-.51-.018-.953-.284L8 13.444l-2.303 1.38q-.443.267-.954.285a.7.7 0 0 1-.152 0q-.512-.018-.954-.284l-2-1.2q-.45-.27-.71-.728t-.26-.984V9.752q0-.526.26-.983t.71-.727L4 6.622V4.086q.001-.525.26-.982.26-.457.71-.728zm1.697 9.002v2.112l2 1.2v-2.112zM12 13.487l1.677-1.005q.322-.194.323-.57v-1.737l-2 1.202zM13.367 9l-2.034 1.223L9.296 9l2.037-1.222zm-4.7-1.176V5.71l2-1.202v2.115zm1.367-4.49-1.69-1.015q-.344-.206-.688 0l-1.69 1.015L8 4.555zm-4.7 1.175 2 1.202v2.113l-2-1.2zM6.703 9 4.667 7.778 2.633 8.999l2.034 1.223zm.63 3.29v-2.113l-2 1.2v2.111zM2 10.174l2 1.202v2.11l-1.677-1.005q-.322-.194-.323-.569z"
  })));
}
export default Boxes;