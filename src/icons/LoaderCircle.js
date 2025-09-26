import * as React from "react";
function LoaderCircle(props) {
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
    id: "LoaderCircle-master_svg0_691_14109"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#LoaderCircle-master_svg0_691_14109)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9.648 2.927q-1.108-.36-2.25-.229-1.1.126-2.065.683T3.71 4.828q-.685.924-.927 2.063t.007 2.261q.24 1.081.895 1.982.655.902 1.609 1.464.99.584 2.148.706t2.249-.244q1.05-.351 1.878-1.097.828-.745 1.287-1.752.477-1.047.477-2.211a.667.667 0 1 1 1.334 0q0 1.454-.598 2.764-.574 1.26-1.608 2.19-1.034.931-2.347 1.37-1.365.458-2.811.306t-2.686-.883q-1.193-.703-2.01-1.829-.818-1.125-1.118-2.477-.312-1.405-.01-2.827.302-1.423 1.159-2.58.824-1.112 2.029-1.808 1.205-.695 2.58-.853 1.43-.163 2.813.286a.667.667 0 1 1-.412 1.268"
  })));
}
export default LoaderCircle;