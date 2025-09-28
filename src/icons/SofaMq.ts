import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function SofaMq(props: IconProps): React.ReactElement {
  return /*#__PURE__*/React.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 48 48",
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
    id: "SofaMq-master_svg0_1_0302"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 48,
    height: 48,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#SofaMq-master_svg0_1_0302)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M14.706 9.314a5.34 5.34 0 1 1-10.681 0 5.34 5.34 0 0 1 10.68 0m21.307 9.447c.974.486 2.069.7 3.162.556a5.34 5.34 0 1 0-5.185-8.192c-.914 1.412-1.724 3.048-3.186 3.879l-.07.04c-2.022 1.148-4.526.621-6.628-.373a10.3 10.3 0 0 0-4.411-.99c-5.7 0-10.32 4.62-10.32 10.32 0 5.698 4.62 10.318 10.32 10.318 1.75 0 3.45-.444 4.952-1.266 1.905-1.042 4.258-1.575 6.147-.502 1.457.827 2.201 2.517 2.987 3.996a5.34 5.34 0 1 0 3.548-7.713c-1.68.378-3.575.792-5.072-.059-1.603-.91-2.261-2.833-2.244-4.677a11 11 0 0 0-.02-.756c-.11-1.715.521-3.46 1.971-4.391 1.218-.782 2.91-.758 4.049-.19M14.973 26a2 2 0 1 0 0-4 2 2 0 0 0 0 4m5 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4m5 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4M14.706 38.686a5.34 5.34 0 1 1-10.681 0 5.34 5.34 0 0 1 10.68 0"
  })));
}
export default SofaMq;