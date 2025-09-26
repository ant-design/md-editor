import * as React from "react";
function App(props) {
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
    id: "App-master_svg0_745_10834"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#App-master_svg0_745_10834)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1.333 2.667V6q0 .552.39.943.391.39.944.39H6q.552 0 .943-.39T7.333 6V2.667q0-.553-.39-.943T6 1.334H2.667q-.553 0-.943.39t-.39.943M6 6H2.667V2.667H6zm-4.667 4v3.333q0 .553.39.943.391.39.944.39H6q.552 0 .943-.39t.39-.943V10q0-.552-.39-.943T6 8.667H2.667q-.553 0-.943.39t-.39.943M6 13.333H2.667V10H6zM8.667 2.667V6q0 .552.39.943t.943.39h3.333q.553 0 .943-.39t.39-.943V2.667q0-.553-.39-.943t-.943-.39H10q-.552 0-.943.39t-.39.943M13.333 6H10V2.667h3.333zm-4.666 4v3.333q0 .553.39.943t.943.39h3.333q.553 0 .943-.39t.39-.943V10q0-.552-.39-.943t-.943-.39H10q-.552 0-.943.39t-.39.943m4.666 3.333H10V10h3.333z"
  })));
}
export default App;