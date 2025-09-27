import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function AlipayBlack(props: IconProps): React.ReactElement {
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
    id: "AlipayBlack-master_svg0_970_25963"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 48,
    height: 48,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#AlipayBlack-master_svg0_970_25963)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M30.175 31.299c-4.21 5.051-8.56 8.14-15.157 8.14-6.598 0-10.95-4.072-10.387-8.982.282-3.227 2.527-8.563 12.211-7.72 5.055.422 7.438 1.404 11.65 2.808 1.121-1.966 1.965-4.213 2.666-6.458H12.633v-1.824h9.12V14.04H10.67v-2.11h11.088V7.158q.141-.7.983-.7h4.63v5.471H39.16v1.966H27.227v3.227h9.685a34.3 34.3 0 0 1-3.93 9.826c2.386.841 12.07 3.789 14.88 4.63V7.022A7.04 7.04 0 0 0 40.839 0H7.017A7.04 7.04 0 0 0 0 7.02v33.96A7.04 7.04 0 0 0 7.02 48h33.96A7.04 7.04 0 0 0 48 40.98V39.3c-2.386-1.123-13.053-5.756-17.825-8.004z",
    style: {
      mixBlendMode: "passthrough"
    }
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5.726 30.079c-.423 1.96.706 6.627 7.788 6.627 4.249 0 8.498-2.86 11.898-7.528-4.817-2.56-8.781-3.766-13.313-3.766-3.967.15-5.95 2.71-6.373 4.667",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default AlipayBlack;