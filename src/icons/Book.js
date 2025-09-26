import * as React from "react";
function Book(props) {
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
    id: "Book-master_svg0_1308_37668"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Book-master_svg0_1308_37668)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6.5 23q-1.45 0-2.475-1.025T3 19.5v-15q0-1.45 1.025-2.475T6.5 1H19q2 0 2 2v18q0 2-2 2zM5 4.5v11.826Q5.682 16 6.5 16H19V3H6.5Q5 3 5 4.5M6.5 18Q5 18 5 19.5T6.5 21H19v-3z",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default Book;