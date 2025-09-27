import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function AppAi(props: IconProps): React.ReactElement {
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
    id: "AppAi-master_svg0_999_25973"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#AppAi-master_svg0_999_25973)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M11.89 2a1 1 0 0 1 .222.026 8.74 8.74 0 0 0-1.536 4.975 8.8 8.8 0 0 0 .784 3.648l-.058.317H4.034c-.572 0-.947-.489-.838-1.091l.834-4.603C4.357 3.465 6.013 2 7.728 2zm1.863 6.48-1.624-.646 1.624-.645c1.487-.59 2.66-1.85 3.21-3.446l.602-1.742.6 1.742C18.717 5.34 19.89 6.6 21.378 7.19L23 7.834l-1.623.645c-1.488.59-2.661 1.85-3.211 3.446l-.601 1.743-.601-1.743c-.55-1.596-1.724-2.855-3.211-3.446M2.426 14.124 1 22h7.268c.572 0 1.124-.488 1.233-1.09l1.427-7.876H3.659c-.572 0-1.124.489-1.233 1.091m18.385.776a7.3 7.3 0 0 1-2.47.433c-1.994 0-3.912-.823-5.356-2.3h-.14L11.42 20.91c-.109.603.266 1.091.838 1.091h4.163c1.715 0 3.37-1.465 3.698-3.272z"
  })));
}
export default AppAi;