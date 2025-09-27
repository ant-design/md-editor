import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function EnterpriseManagement(props: IconProps): React.ReactElement {
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
    id: "EnterpriseManagement-master_svg0_1036_34397"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#EnterpriseManagement-master_svg0_1036_34397)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m21.703 12.946-.976-.86v7.692c0 1.227-.977 2.222-2.182 2.222H5.455c-1.205 0-2.182-.995-2.182-2.222v-7.692l-.976.86a1.11 1.11 0 0 1-1.493-1.645l8.977-8.378Q10.713 2 12 2t2.219.923l8.977 8.378a1.11 1.11 0 0 1-1.493 1.645m-14.067 2.6 1.036 1.797 1.076-.372c.296.244.633.436.998.574l.218 1.122h2.072l.218-1.122c.365-.138.702-.33.998-.574l1.076.372 1.036-1.797-.862-.75q.048-.28.05-.574-.002-.294-.05-.574l.862-.75-1.036-1.796-1.076.371a3.6 3.6 0 0 0-.998-.574l-.218-1.121h-2.072l-.218 1.121c-.365.138-.702.33-.998.574l-1.076-.371-1.036 1.796.862.75c-.03.187-.05.378-.05.574s.02.387.05.575zm6.07-1.338c0 .92-.732 1.666-1.636 1.666s-1.637-.746-1.637-1.666.733-1.667 1.637-1.667 1.636.746 1.636 1.667"
  })));
}
export default EnterpriseManagement;