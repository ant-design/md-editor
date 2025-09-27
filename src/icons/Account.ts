import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Account(props: IconProps): React.ReactElement {
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
    id: "Account-master_svg0_1_3966"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Account-master_svg0_1_3966)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 1a1 1 0 0 0-1 1v1H5q-1.243 0-2.121.879Q2 4.757 2 6v14q0 1.243.879 2.121Q3.757 23 5 23h14q1.243 0 2.121-.879Q22 21.243 22 20V6q0-1.243-.879-2.121Q20.243 3 19 3h-2V2a1 1 0 1 0-2 0v1H9V2a1 1 0 0 0-1-1m-.011 4H19q1 0 1 1v14q0 1-1 1h-.15q-.298-2.262-1.985-3.95-.758-.758-1.632-1.236a5 5 0 1 0-6.53-.056q-.934.489-1.738 1.292Q5.278 18.737 4.98 21 4 20.99 4 20V6q0-1 1-1zm-.982 16h9.816q-.275-1.438-1.372-2.536Q13.986 17 11.915 17T8.38 18.464Q7.282 19.562 7.007 21M15 12a3 3 0 1 0-6 0 3 3 0 0 0 6 0",
    style: {
      mixBlendMode: "passthrough"
    }
  })));
}
export default Account;