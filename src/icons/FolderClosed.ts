import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function FolderClosed(props: IconProps): React.ReactElement {
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
    id: "FolderClosed-master_svg0_2771_15063"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#FolderClosed-master_svg0_2771_15063)"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M4,21Q2.7573600000000003,21,1.8786800000000001,20.1213Q1,19.2426,1,18L1,5Q1,3.7573600000000003,1.8786800000000001,2.87868Q2.7573600000000003,2,4,2L7.93,2Q9.5458,2,10.42885,3.34053L11.2452,4.550050000000001Q11.545,5.00539,12.1,5L20,5Q21.2426,5,22.1213,5.87868Q23,6.75736,23,8L23,18Q23,19.2426,22.1213,20.1213Q21.2426,21,20,21L4,21ZM21,9L21,8Q21,7.58579,20.7071,7.29289Q20.4142,7,20,7L12.1,7Q10.4743,7.01599,9.5748,5.6499500000000005L8.771149999999999,4.45947Q8.46838,4,7.93,4L4,4Q3,4,3,5L3,9L21,9ZM3,11L21,11L21,18Q21,19,20,19L4,19Q3,19,3,18L3,11Z",
    style: {
      mixBlendMode: "passthrough"
    }
  }))));
}
export default FolderClosed;