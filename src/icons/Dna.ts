import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Dna(props: IconProps): React.ReactElement {
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
    id: "Dna-master_svg0_1119_32782"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Dna-master_svg0_1119_32782)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10.667 1.333a.67.67 0 0 1-.171.446q-.106.117-.205.236l1.514 1.514a.667.667 0 0 1-.943.942L9.526 3.135q-.125.23-.23.465-.115.263-.209.544l.718.718a.667.667 0 0 1-.943.943l-.151-.151a.667.667 0 0 1-1.242-.42q.079-.547.215-1.053l.013-.046q.154-.562.38-1.073.312-.707.777-1.364l.016-.022q.288-.404.634-.789a.667.667 0 0 1 1.163.446m4.446 5.163a.667.667 0 0 0-.892-.992l-.002.002q-.116.104-.234.202l-.18-.18a.667.667 0 0 0-.943.943q-.487.264-1.007.44l-.384-.382a.667.667 0 0 0-1.097.7q-.94.104-2.374.104-1.13 0-1.704.033-.981.055-1.776.234-.179.04-.354.088l-.019.005q-1.298.359-2.42 1.143a1 1 0 0 0-.076.053q-.393.281-.764.615a.667.667 0 0 0 .892.992q.117-.106.236-.204l.18.18a.667.667 0 0 0 .943-.943q.487-.264 1.007-.44l.384.382a.667.667 0 0 0 1.097-.7q.94-.104 2.374-.104 1.13 0 1.704-.033.981-.055 1.776-.234.179-.04.354-.088l.019-.005q1.298-.358 2.42-1.143a1 1 0 0 0 .076-.053q.393-.281.764-.615m-6.81 5.37.013-.047q.136-.506.215-1.052a.667.667 0 0 0-1.242-.42l-.15-.152a.667.667 0 1 0-.944.943l.718.718q-.094.28-.21.544-.104.235-.229.465l-1.336-1.336a.667.667 0 0 0-.943.942l1.514 1.514q-.1.119-.205.236a.666.666 0 1 0 .992.892q.346-.385.634-.789l.016-.022q.465-.657.777-1.364.225-.511.38-1.073",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default Dna;