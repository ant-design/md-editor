import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function FileText(props: IconProps): React.ReactElement {
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
    id: "FileText-master_svg0_2197_15844"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#FileText-master_svg0_2197_15844)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20.999 7.038a.88.88 0 0 0-.224-.587L16.12 1.28A.84.84 0 0 0 15.494 1H5.71q-1.144 0-1.942.886-.77.855-.77 2.05v16.128q0 1.195.77 2.05Q4.567 23 5.71 23h12.575q1.144 0 1.942-.886.77-.855.77-2.05zm-7.287-4.303h-8q-.398 0-.691.325-.322.357-.322.875v16.13q0 .518.322.875.293.325.69.325h12.575q.397 0 .69-.325.321-.357.321-.875l.001-10.92h-2.874q-1.145 0-1.943-.887-.769-.855-.769-2.049zm1.7.325v3.15q0 .518.322.875.292.325.69.325h2.874v-.035zM8.28 7.824h1.861c.47 0 .85.388.85.867 0 .48-.38.867-.85.867H8.28a.86.86 0 0 1-.851-.867c0-.479.38-.867.85-.867m0 4.136h7.445c.47 0 .85.388.85.867 0 .48-.38.868-.85.868H8.28a.86.86 0 0 1-.85-.868c0-.479.38-.867.85-.867m0 4.136h7.445c.47 0 .85.388.85.867 0 .48-.38.868-.85.868H8.28a.86.86 0 0 1-.85-.867c0-.48.38-.868.85-.868"
  })));
}
export default FileText;