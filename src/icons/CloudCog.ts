import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
function CloudCog(props: IconProps): React.ReactElement {
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
    id: "CloudCog-master_svg0_642_13352"
  }, /*#__PURE__*/React.createElement("rect", {
    width: 16,
    height: 16,
    rx: 0
  }))), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#CloudCog-master_svg0_642_13352)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12.954 10.252q.626-.434.876-1.152.25-.72.028-1.447-.222-.729-.83-1.186-.61-.457-1.37-.467h-1.185a.67.67 0 0 1-.638-.475q-.277-.924-.93-1.61-.625-.656-1.48-.98-.855-.326-1.758-.251-.943.078-1.764.584-.82.507-1.314 1.315-.472.773-.565 1.683t.213 1.763q.32.89 1.02 1.552a.667.667 0 1 1-.915.97Q1.41 9.671.982 8.48.574 7.342.697 6.13q.124-1.21.754-2.242.66-1.08 1.752-1.754t2.354-.779q1.204-.1 2.342.333t1.972 1.308q.7.735 1.075 1.67h.73q1.196.017 2.152.735.957.719 1.306 1.863.348 1.144-.045 2.274-.392 1.129-1.375 1.81h-.001a.666.666 0 1 1-.759-1.096M6.267 8.867c0 .084.016.169.047.247l.047.116q-.31.242-.538.564l-.079-.026a.667.667 0 0 0-.421 1.264l.026.01a2.7 2.7 0 0 0 .017.707l-.08.032a.667.667 0 0 0 .495 1.238l.116-.046c.16.205.35.387.563.538l-.026.078a.666.666 0 1 0 1.265.422l.009-.027a2.7 2.7 0 0 0 .708-.016l.032.08a.667.667 0 1 0 1.238-.496l-.047-.115q.31-.241.539-.564l.078.026a.666.666 0 1 0 .422-1.265l-.027-.009a2.7 2.7 0 0 0-.017-.707l.08-.032a.667.667 0 1 0-.495-1.238l-.116.046a2.7 2.7 0 0 0-.563-.538l.026-.079A.667.667 0 1 0 8.3 8.656l-.009.026a2.7 2.7 0 0 0-.708.017l-.032-.08a.667.667 0 0 0-1.285.248m2.42 3.61a1.33 1.33 0 0 0 .59-1.531.66.66 0 0 1-.134-.3 1.33 1.33 0 0 0-1.53-.589.66.66 0 0 1-.3.133 1.33 1.33 0 0 0-.59 1.531.66.66 0 0 1 .134.3 1.33 1.33 0 0 0 1.53.588.66.66 0 0 1 .3-.133"
  })));
}
export default CloudCog;