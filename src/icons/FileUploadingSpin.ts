import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function FileUploadingSpin(props: IconProps): React.ReactElement {
  return /*#__PURE__*/React.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 48 48"
  }, props, {
    style: Object.assign({
      verticalAlign: '-0.125em'
    }, props.style),
    className: ['sofa-icons-icon', props.className].filter(Boolean).join(' '),
    width: "1em",
    height: "1em"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#8C8C8C",
    d: "M8 39a5 5 0 0 0 5 5h22a5 5 0 0 0 5-5V14L30 4H13a5 5 0 0 0-5 5z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#DBDBDB",
    fillRule: "evenodd",
    d: "m30 4 10 10h-6c-1.4 0-2.116-.003-2.649-.279a2.5 2.5 0 0 1-1.072-1.072C30.003 12.116 30 11.4 30 10z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#FFF",
    fillRule: "evenodd",
    d: "M30.718 17.282Q27.935 14.5 24 14.5q-.074 0-.147.007t-.146.022-.142.036-.139.05q-.068.027-.133.062t-.126.076-.119.087-.109.1-.099.108q-.046.057-.087.119-.041.06-.076.126-.035.065-.063.133t-.05.139q-.02.07-.035.142-.015.073-.022.146T22.5 16t.007.147.022.146q.014.072.036.142t.05.139.062.133.076.126q.04.062.087.119t.1.109.108.099.119.087.126.076.133.063.139.05q.07.02.142.035.073.015.146.022T24 17.5q2.692 0 4.596 1.904T30.5 24t-1.904 4.596T24 30.5t-4.596-1.904-1.904-4.594V24q0-.074-.007-.147t-.022-.146-.036-.142-.05-.139q-.027-.068-.062-.133t-.076-.126-.087-.119-.1-.109-.108-.099q-.057-.046-.119-.087-.06-.041-.126-.076-.065-.035-.133-.063t-.139-.05q-.07-.02-.142-.035-.073-.015-.146-.022T16 22.5t-.147.007-.146.022q-.072.014-.142.036t-.139.05-.133.062-.126.076q-.062.04-.119.087t-.109.1-.099.108-.087.119-.076.126-.063.133-.05.139q-.02.07-.035.142-.015.073-.022.146T14.5 24q0 3.935 2.782 6.718T24 33.5t6.718-2.782T33.5 24t-2.782-6.718"
  }, /*#__PURE__*/React.createElement("animateTransform", {
    attributeName: "transform",
    attributeType: "XML",
    dur: "1.5s",
    from: "0 24 24",
    repeatCount: "indefinite",
    to: "360 24 24",
    type: "rotate"
  })));
}
export default FileUploadingSpin;