import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Light(props: IconProps): React.ReactElement {
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
    id: "Light-master_svg0_2243_13341"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Light-master_svg0_2243_13341)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 1q3.52 0 6.01 2.49T20.5 9.5t-2.49 6.01q-.386.387-.817.72V17q0 1.036-.732 1.768t-1.768.732H9.307q-1.036 0-1.768-.732T6.807 17v-.77q-.43-.333-.817-.72Q3.5 13.02 3.5 9.5t2.49-6.01T12 1m0 2Q9.308 3 7.404 4.904T5.5 9.5t1.904 4.596q.443.444.962.794l.44.298V17q0 .5.5.5h5.387q.5 0 .5-.5v-1.812l.44-.298q.52-.35.963-.794Q18.5 12.192 18.5 9.5t-1.904-4.596T12 3m.093 2.091a1 1 0 0 1-.8.98l-.084.018a1 1 0 0 1-.45-1.948l.134-.03a1 1 0 0 1 1.2.98M9.818 6.318a1 1 0 0 1-.293.707Q8.5 8.051 8.5 9.5a1 1 0 1 1-2 0q0-2.278 1.61-3.889a1 1 0 0 1 1.708.707M15 20.5H9a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default Light;