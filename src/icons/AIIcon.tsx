import React from 'react';

export const AIIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width={20}
      height={20}
      viewBox="0 0 20 20"
      {...props}
    >
      <defs>
        <linearGradient
          x1={0}
          y1={0}
          x2={0.9051534344090318}
          y2={0.826973583838761}
          id="b"
        >
          <stop offset="0%" stopColor="#D7B9FF" />
          <stop offset="33.85770916938782%" stopColor="#ADB1FF" />
          <stop offset="68.1729257106781%" stopColor="#6CDAFF" />
          <stop offset="91.42857193946838%" stopColor="#D1F0FF" />
        </linearGradient>
        <mask
          id="a"
          style={{
            maskType: 'alpha',
          }}
          maskUnits="objectBoundingBox"
        >
          <ellipse
            cx={9.999998092651367}
            cy={9.999999046325684}
            rx={9.999998092651367}
            ry={9.999999046325684}
            fill="#FFF"
          />
        </mask>
        <linearGradient
          x1={0.696781575679779}
          y1={0.19262488186359406}
          x2={0.4333105059029861}
          y2={0.9908274135482789}
          id="c"
        >
          <stop offset="0%" stopColor="#FFF" />
          <stop
            offset="100%"
            stopColor="#D5DFFF"
            stopOpacity={0.7699999809265137}
          />
        </linearGradient>
        <linearGradient x1={0.5} y1={0} x2={0.5} y2={1} id="d">
          <stop offset="0%" stopColor="#FFF" />
          <stop offset="98.57142567634583%" stopColor="#7D76FF" />
        </linearGradient>
        <linearGradient x1={0.5} y1={0} x2={0.5} y2={1} id="e">
          <stop offset="0%" stopColor="#EAFFD2" />
          <stop
            offset="57.14285969734192%"
            stopColor="#FFC9AD"
            stopOpacity={0}
          />
        </linearGradient>
        <filter
          id="f"
          filterUnits="objectBoundingBox"
          colorInterpolationFilters="sRGB"
          x={0}
          y={0}
          width={1}
          height={1}
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy={-1.5430299043655396} dx={-1.2858575582504272} />
          <feGaussianBlur stdDeviation={5.700080394744873} />
          <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
          <feColorMatrix values="0 0 0 0 0.8230088353157043 0 0 0 0 0.9085546135902405 0 0 0 0 1 0 0 0 0.019999999552965164 0" />
          <feBlend in2="shape" result="effect1_innerShadow" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy={-0.2571716010570526} dx={-0.2571716010570526} />
          <feGaussianBlur stdDeviation={1.0286864042282104} />
          <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.30000001192092896 0" />
          <feBlend in2="effect1_innerShadow" result="effect2_innerShadow" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy={-3.343230724334717} dx={-1.2858575582504272} />
          <feGaussianBlur stdDeviation={1.0286864042282104} />
          <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
          <feColorMatrix values="0 0 0 0 0.7568627595901489 0 0 0 0 0.8352941274642944 0 0 0 0 1 0 0 0 0.20000000298023224 0" />
          <feBlend in2="effect2_innerShadow" result="effect3_innerShadow" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy={-0.6789327263832092} dx={-0.2160240262746811} />
          <feGaussianBlur stdDeviation={0.3857574760913849} />
          <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0" />
          <feBlend in2="effect3_innerShadow" result="effect4_innerShadow" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset />
          <feGaussianBlur stdDeviation={1.186086893081665} />
          <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6499999761581421 0" />
          <feBlend in2="effect4_innerShadow" result="effect5_innerShadow" />
          <feGaussianBlur
            in="BackgroundImageFix"
            stdDeviation={1.0026473999023438}
          />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect6_foregroundBlur"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect6_foregroundBlur"
            result="shape"
          />
        </filter>
        <radialGradient
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          id="g"
          gradientTransform="matrix(-10.37711 2.34618 -2.1191 -9.37275 51.624 13.155)"
        >
          <stop offset="68.62291693687439%" stopColor="#FFF" />
          <stop offset="100%" stopColor="#7C7EFC" />
        </radialGradient>
        <filter
          id="h"
          filterUnits="objectBoundingBox"
          colorInterpolationFilters="sRGB"
          x={-0.2766313886082008}
          y={-0.3890368923878318}
          width={1.5532627772164016}
          height={1.7780737847756636}
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            stdDeviation={0.9114986658096313}
            result="effect1_foregroundBlur"
          />
        </filter>
        <radialGradient
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          id="i"
          gradientTransform="matrix(8.3414 4.46374 -4.56222 8.52544 49.88 15.307)"
        >
          <stop
            offset="15.000000596046448%"
            stopColor="#DCD9FF"
            stopOpacity={0.4000000059604645}
          />
          <stop
            offset="100%"
            stopColor="#5879FF"
            stopOpacity={0.5799999833106995}
          />
        </radialGradient>
        <linearGradient x1={0.5} y1={0} x2={0.5} y2={1} id="j">
          <stop offset="0%" stopColor="#FFF" />
          <stop
            offset="100%"
            stopColor="#FAFDFF"
            stopOpacity={0.33000001311302185}
          />
        </linearGradient>
        <linearGradient x1={0.5} y1={0} x2={0.5} y2={1} id="k">
          <stop offset="0%" stopColor="#FFF" />
          <stop
            offset="100%"
            stopColor="#FAFDFF"
            stopOpacity={0.33000001311302185}
          />
        </linearGradient>
        <linearGradient
          x1={0.8096945285797119}
          y1={0.029296884313225746}
          x2={0.5695514416235836}
          y2={1.0151441985506158}
          id="l"
        >
          <stop offset="0%" stopColor="#192353" />
          <stop
            offset="99.28571581840515%"
            stopColor="#252C5B"
            stopOpacity={0.9399999976158142}
          />
        </linearGradient>
        <linearGradient
          x1={0.8096945285797119}
          y1={0.029296884313225746}
          x2={0.5695514416235836}
          y2={1.0151441985506158}
          id="m"
        >
          <stop offset="0%" stopColor="#192353" />
          <stop
            offset="99.28571581840515%"
            stopColor="#252C5B"
            stopOpacity={0.9399999976158142}
          />
        </linearGradient>
        <filter
          id="n"
          filterUnits="objectBoundingBox"
          colorInterpolationFilters="sRGB"
          x={-0.8109448201444664}
          y={-0.9617025206484545}
          width={2.621889640288933}
          height={2.923405041296909}
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            stdDeviation={1.3034429550170898}
            result="effect1_foregroundBlur"
          />
        </filter>
        <filter
          id="o"
          filterUnits="objectBoundingBox"
          colorInterpolationFilters="sRGB"
          x={-0.758287473039678}
          y={-0.9650923108804433}
          width={2.516574946079356}
          height={2.9301846217608865}
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            stdDeviation={1.137550711631775}
            result="effect1_foregroundBlur"
          />
        </filter>
        <filter
          id="p"
          filterUnits="objectBoundingBox"
          colorInterpolationFilters="sRGB"
          x={-0.1117678344645213}
          y={-0.11737885603751197}
          width={1.2235356689290426}
          height={1.234757712075024}
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            stdDeviation={0.2658695578575134}
            result="effect1_foregroundBlur"
          />
        </filter>
      </defs>
      <g mask="url(#a)">
        <ellipse
          cx={9.999998092651367}
          cy={9.999999046325684}
          rx={9.999998092651367}
          ry={9.999999046325684}
          fill="url(#b)"
        />
        <path
          d="M58.95 12.485c0 5.65-4.339 8.916-10.125 8.916S38.59 18.134 38.59 12.485c0-5.65 4.558-10.23 10.18-10.23s10.18 4.58 10.18 10.23z"
          fill="url(#c)"
          transform="matrix(-1 0 0 1 36.543 0) scale(-1 1) rotate(3.563 0 -1238.67)"
        />
        <ellipse
          cx={43.53669500350952}
          cy={10.51047420501709}
          rx={3.964707851409912}
          ry={4.286174297332764}
          fill="url(#d)"
          transform="matrix(-1 0 0 1 36.543 0) scale(-1 1) rotate(3.563 0 -1238.67)"
        />
        <ellipse
          cx={47.501317501068115}
          cy={11.716431617736816}
          rx={6.643563747406006}
          ry={5.57202672958374}
          fill="url(#e)"
          transform="matrix(-1 0 0 1 36.543 0) scale(-1 1) rotate(3.563 0 -1238.67)"
        />
        <g
          filter="url(#f)"
          transform="matrix(-1 0 0 1 36.543 0) scale(-1 1) rotate(3.563 0 -1238.67)"
        >
          <path
            d="M58.95 12.485c0 5.65-4.247 8.91-10.033 8.91-5.787 0-10.326-3.26-10.326-8.91s4.558-10.23 10.18-10.23 10.18 4.58 10.18 10.23z"
            fill="url(#g)"
            fillOpacity={0.30000001192092896}
          />
        </g>
        <g
          filter="url(#h)"
          transform="matrix(-1 0 0 1 36.543 0) scale(-1 1) rotate(3.563 0 -1238.67)"
        >
          <path
            d="M53.216 16.809c0 1.893-5.357 2.036-8.68 1.071-3.642-1.5-4.5-4-4.5-5.893 0-1.894 3.03-2.894 6.108-2.894 3.077 0 7.072 5.822 7.072 7.716z"
            fill="url(#i)"
          />
        </g>
        <path
          d="M45.636 9.488a2.69 2.69 0 115.38 0v1.733a2.69 2.69 0 11-5.38 0z"
          fill="url(#j)"
          transform="matrix(-1 0 0 1 36.543 0) scale(-1 1) rotate(3.563 0 -1238.67) rotate(-9.779 43.39 6.778) rotate(18.357 45.636 6.778)"
        />
        <path
          d="M52.312 9.333a2.556 2.556 0 115.111 0v2.002a2.556 2.556 0 11-5.111 0z"
          fill="url(#k)"
          transform="matrix(-1 0 0 1 36.543 0) scale(-1 1) rotate(3.563 0 -1238.67) rotate(-9.779 43.39 6.778) rotate(18.357 45.636 6.778)"
        />
        <rect
          x={46.712342262268066}
          y={7.61848783493042}
          width={3.497103214263916}
          height={5.198186874389648}
          rx={1.748551607131958}
          fill="url(#l)"
          transform="matrix(-1 0 0 1 36.543 0) scale(-1 1) rotate(3.563 0 -1238.67) rotate(-9.779 43.39 6.778) rotate(18.357 45.636 6.778)"
        />
        <rect
          x={53.118836402893066}
          y={7.59816312789917}
          width={3.497103214263916}
          height={5.198186874389648}
          rx={1.748551607131958}
          fill="url(#m)"
          transform="matrix(-1 0 0 1 36.543 0) scale(-1 1) rotate(3.563 0 -1238.67) rotate(-9.779 43.39 6.778) rotate(18.357 45.636 6.778)"
        />
        <g
          transform="matrix(-1 0 0 1 36.543 0) scale(-1 1) rotate(3.563 0 -1238.67) matrix(-1 0 0 1 92.311 0)"
          filter="url(#n)"
        >
          <path
            d="M46.156 18.32c1.929.856 4.929-1.608 6.429-5.251q-4.179 5.25-6.43 5.25z"
            fill="#FFFDDF"
          />
        </g>
        <g
          transform="matrix(-1 0 0 1 36.543 0) scale(-1 1) rotate(3.563 0 -1238.67) scale(-1 1) rotate(13.259 0 -376.173)"
          filter="url(#o)"
        >
          <path
            d="M45.288 18.212c.858 0 5.251-.75 6.001-4.714q-3 4.179-6 4.714z"
            fill="#6CE7FF"
            fillOpacity={0.501960813999176}
          />
        </g>
        <g
          transform="matrix(-1 0 0 1 36.543 0) scale(-1 1) rotate(42.407 0 -59.801)"
          filter="url(#p)"
          opacity={0.20000000298023224}
        >
          <path
            d="M28.49 22.694c4.874-1.821 6.755-3.54 9.514-9.06q-3.748 6.574-9.515 9.06z"
            fill="#FFF"
          />
        </g>
      </g>
    </svg>
  );
};
