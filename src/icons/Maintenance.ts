import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function Maintenance(props: IconProps): React.ReactElement {
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
    id: "Maintenance-master_svg0_245_40613"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 24,
    height: 24,
    rx: 0
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "Maintenance-master_svg1_22_11520",
    x1: 0.701,
    x2: -0.082,
    y1: 0.757,
    y2: 0
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#263447"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#101413",
    stopOpacity: 0.34
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#Maintenance-master_svg0_245_40613)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m17.81 17.227.005-.009c.976.71 2.34.66 3.246-.22l.156-.155c.357-.347.527-.842.625-1.312.064-.3.101-.602.121-.907q.013-.222.017-.444c.003-.146.055-.308-.023-.445-.005-.011-.014-.025-.026-.031-.02-.011-.046 0-.066.011-.227.126-.38.341-.559.518q-.293.289-.582.582c-.218.224-.504.442-.835.47a3 3 0 0 1-.697-.045c-.207-.034-.447-.053-.64-.132-.239-.098-.293-.335-.345-.556-.116-.493-.291-1.187.13-1.59q.206-.198.408-.397.427-.412.853-.825l.08-.079c.047-.044.087-.126.015-.168-.037-.022-.083-.02-.127-.016-.51.044-1.017.016-1.53.1-.524.087-1.077.244-1.483.596q-.035.03-.066.062l-.159.151a2.36 2.36 0 0 0-.233 3.159l-4.462 3.928c-.354.344-.824 1.285 0 2.082.824.8 1.789.344 2.143 0q2.924-3.106 3.175-3.377m-4.131 2.935a.74.74 0 0 1-.752-.73c0-.403.337-.73.752-.73s.752.327.752.73-.337.73-.752.73m-2.449-8.117c1.268 0 2.463-.126 3.538-.341.682-1.827 2.48-3.137 4.591-3.137.075 0 .15.009.225.011.006-.05.017-.1.017-.15V6.61c0 2-3.747 3.618-8.37 3.618C5.747 10.229 2 8.612 2 6.61v2.767c0 2 3.748 3.618 8.371 3.618m0-3.758c4.624 0 8.372-1.62 8.372-3.617C18.743 3.62 14.994 2 10.37 2S2 3.617 2 5.618s3.748 3.62 8.371 3.62m0 7.519c.464 0 .92-.02 1.363-.05l1.904-1.85.011-.011a5 5 0 0 1-.037-.58q.001-.284.037-.565a18.3 18.3 0 0 1-3.278.288C5.748 13.99 2 12.372 2 10.372v2.767c0 2 3.748 3.618 8.371 3.618M2 14.132v2.767c0 1.903 3.393 3.459 7.706 3.604-.107-.907.055-1.883.527-2.342l.43-.417c-.099.003-.194.006-.295.006C5.748 17.75 2 16.13 2 14.132"
  })));
}
export default Maintenance;