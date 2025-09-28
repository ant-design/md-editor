import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Headset(props: IconProps): React.ReactElement {
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
    id: "Headset-master_svg0_824_18501"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Headset-master_svg0_824_18501)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M13.296 6.667H12q-.828 0-1.414.586Q10 7.838 10 8.667v2q0 .828.586 1.414t1.414.586h.667q.309 0 .585-.082-.137.462-.504.83-.586.585-1.415.585H8a.667.667 0 1 0 0 1.333h3.333q1.381 0 2.357-.976T14.667 12V7.333q0-1.356-.524-2.595-.506-1.197-1.428-2.12-.923-.923-2.12-1.429Q9.357.665 8 .665t-2.596.524q-1.196.506-2.119 1.43-.922.922-1.428 2.119-.524 1.24-.524 2.596v3.333q0 .828.586 1.414t1.414.586H4q.828 0 1.414-.586T6 10.667v-2q0-.829-.586-1.414Q4.828 6.667 4 6.667H2.704q.203-1.785 1.524-3.106Q5.79 1.998 8 1.998t3.772 1.563q1.321 1.321 1.524 3.106m.037 4V8H12q-.276 0-.471.195-.196.196-.196.472v2q0 .276.196.471.195.195.471.195h.667q.276 0 .471-.195t.195-.471M2.667 8v2.667q0 .276.195.471t.471.195H4q.276 0 .471-.195.196-.195.196-.471v-2q0-.276-.196-.472Q4.276 8 4 8z"
  })));
}
export default Headset;