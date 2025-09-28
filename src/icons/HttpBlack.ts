import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function HttpBlack(props: IconProps): React.ReactElement {
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
    id: "HttpBlack-master_svg0_1211_34237"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 48,
    height: 48,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#HttpBlack-master_svg0_1211_34237)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M40.28 21.124c3.278.805 5.72 3.822 5.72 7.398 0 4.201-3.344 7.62-7.48 7.62H10.316C5.718 36.143 2 32.344 2 27.673c0-4.67 3.74-8.447 8.338-8.447.528 0 1.012.044 1.496.134a5 5 0 0 1-.066-.827c0-3.219 2.574-5.833 5.742-5.833 1.848 0 3.476.871 4.532 2.257 1.87-2.414 4.774-3.956 8.03-3.956 5.544 0 10.076 4.515 10.208 10.124m-23.848 9.454h1.496v-7.51h-1.496v2.95h-2.926v-2.95H12.01v7.51h1.496v-3.285h2.926zm6.182-6.235h2.2v-1.274H18.94v1.274h2.2V30.6h1.474zm6.314 0h2.178v-1.274h-5.874v1.274h2.2V30.6h1.496zm7.964 2.95c.264-.18.462-.425.638-.738.154-.313.242-.715.264-1.162 0-.604-.154-1.095-.44-1.475q-.429-.57-1.056-.738c-.286-.067-.88-.111-1.782-.111h-2.398V30.6h1.496v-2.838h.968c.66 0 1.188-.045 1.54-.112.264-.067.506-.179.77-.357m-2.574-2.95c.55 0 .902 0 1.078.044a1 1 0 0 1 .836 1.006c0 .224-.066.402-.176.581a.87.87 0 0 1-.462.38c-.198.067-.594.112-1.188.112h-.814v-2.123z",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default HttpBlack;