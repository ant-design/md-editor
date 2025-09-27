import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function BookHeart(props: IconProps): React.ReactElement {
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
    id: "BookHeart-master_svg0_366_15700"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#BookHeart-master_svg0_366_15700)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2.683 14.65q.684.683 1.65.683h8.334q.552 0 .943-.39T14 14V2q0-.552-.39-.943-.391-.39-.943-.39H4.333q-.966 0-1.65.683Q2 2.034 2 3v10q0 .966.683 1.65m.65-3.766V3q0-.414.293-.707T4.333 2h8.334v8.667H4.333q-.545 0-1 .217m7.325-3.8.015-.014q.66-.665.66-1.603-.008-.884-.628-1.505-.621-.62-1.5-.629-.706 0-1.205.332-.496-.332-1.2-.332-.884.008-1.505.629-.62.62-.628 1.499 0 .882.662 1.544Q6.425 8.09 7.54 9.15a.667.667 0 0 0 .914.003L9.882 7.82zm-.925-.96Q10 5.85 10 5.467q-.003-.327-.238-.562t-.568-.238q-.437 0-.64.303a.667.667 0 0 1-1.109 0q-.202-.303-.645-.303-.327.003-.562.238T6 5.473q0 .318.271.589.86.85 1.733 1.687l.967-.904zM3.333 13q0-.414.293-.707T4.333 12h8.334v2H4.333q-.414 0-.707-.293T3.333 13"
  })));
}
export default BookHeart;