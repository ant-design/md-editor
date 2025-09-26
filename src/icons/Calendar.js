import * as React from "react";
function Calendar(props) {
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
    id: "Calendar-master_svg0_341_9076"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Calendar-master_svg0_341_9076)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M13.875 2H12v-.437a.562.562 0 1 0-1.125 0V2h-5.75v-.437a.562.562 0 1 0-1.125 0V2H2.125C1.503 2 1 2.503 1 3.125v10.75C1 14.497 1.503 15 2.125 15h11.75c.622 0 1.125-.505 1.125-1.125V3.125C15 2.503 14.497 2 13.875 2M2.125 3.125H4v.313a.562.562 0 1 0 1.125 0v-.313h5.75v.313a.562.562 0 1 0 1.125 0v-.313h1.875v1.75H2.125zm11.75 10.75H2.125V6h11.75zM4.5 8h1a.5.5 0 1 1 0 1h-1a.5.5 0 1 1 0-1m3 0h1a.5.5 0 1 1 0 1h-1a.5.5 0 1 1 0-1m3 0h1a.5.5 0 1 1 0 1h-1a.5.5 0 1 1 0-1m-6 3.031h1a.5.5 0 1 1 0 1h-1a.5.5 0 1 1 0-1m3 0h1a.5.5 0 1 1 0 1h-1a.5.5 0 1 1 0-1"
  })));
}
export default Calendar;