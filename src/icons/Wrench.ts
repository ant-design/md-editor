import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Wrench(props: IconProps): React.ReactElement {
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
    id: "Wrench-master_svg0_642_13365"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Wrench-master_svg0_642_13365)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m10.278 4.665-.002.002 1.057 1.057 2.509-2.509a.667.667 0 0 1 1.079.197q.6 1.327.34 2.76-.262 1.433-1.292 2.464t-2.464 1.29q-1.198.22-2.323-.165l-4.297 4.297q-.61.61-1.472.61t-1.471-.61-.61-1.471.61-1.472l4.297-4.297q-.384-1.125-.166-2.324.261-1.433 1.291-2.463T9.828.74t2.76.34a.667.667 0 0 1 .197 1.078zm-.95-.936 1.714-1.714q-.479-.054-.975.037-1.024.186-1.76.922t-.922 1.76.242 1.971c.115.253.06.55-.136.746l-4.606 4.607q-.22.219-.22.529t.22.528q.219.22.528.22t.529-.22L8.549 8.51a.67.67 0 0 1 .746-.136q.948.429 1.972.242 1.023-.186 1.76-.922.735-.736.921-1.76.09-.496.036-.975l-1.717 1.718q-.39.381-.934.381t-.938-.386L9.324 5.6q-.381-.389-.381-.933 0-.545.386-.938"
  })));
}
export default Wrench;