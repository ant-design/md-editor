import React from 'react';
import { vi } from 'vitest';

// Framer Motion Mock - 用于加速测试
export const framerMotionMock = {
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    button: ({ children, ...props }: any) => (
      <button type="button" {...props}>
        {children}
      </button>
    ),
    img: ({ ...props }: any) => <img {...props} />,
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
    path: ({ ...props }: any) => <path {...props} />,
    circle: ({ ...props }: any) => <circle {...props} />,
    rect: ({ ...props }: any) => <rect {...props} />,
    g: ({ children, ...props }: any) => <g {...props}>{children}</g>,
    // 添加更多常用的motion组件
    ul: ({ children, ...props }: any) => <ul {...props}>{children}</ul>,
    li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    h4: ({ children, ...props }: any) => <h4 {...props}>{children}</h4>,
    h5: ({ children, ...props }: any) => <h5 {...props}>{children}</h5>,
    h6: ({ children, ...props }: any) => <h6 {...props}>{children}</h6>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
    input: ({ ...props }: any) => <input {...props} />,
    textarea: ({ children, ...props }: any) => (
      <textarea {...props}>{children}</textarea>
    ),
    select: ({ children, ...props }: any) => (
      <select {...props}>{children}</select>
    ),
    option: ({ children, ...props }: any) => (
      <option {...props}>{children}</option>
    ),
    label: ({ children, ...props }: any) => (
      <label {...props}>{children}</label>
    ),
    table: ({ children, ...props }: any) => (
      <table {...props}>{children}</table>
    ),
    thead: ({ children, ...props }: any) => (
      <thead {...props}>{children}</thead>
    ),
    tbody: ({ children, ...props }: any) => (
      <tbody {...props}>{children}</tbody>
    ),
    tr: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
    td: ({ children, ...props }: any) => <td {...props}>{children}</td>,
    th: ({ children, ...props }: any) => <th {...props}>{children}</th>,
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
    header: ({ children, ...props }: any) => (
      <header {...props}>{children}</header>
    ),
    footer: ({ children, ...props }: any) => (
      <footer {...props}>{children}</footer>
    ),
    main: ({ children, ...props }: any) => <main {...props}>{children}</main>,
    section: ({ children, ...props }: any) => (
      <section {...props}>{children}</section>
    ),
    article: ({ children, ...props }: any) => (
      <article {...props}>{children}</article>
    ),
    aside: ({ children, ...props }: any) => (
      <aside {...props}>{children}</aside>
    ),
    figure: ({ children, ...props }: any) => (
      <figure {...props}>{children}</figure>
    ),
    figcaption: ({ children, ...props }: any) => (
      <figcaption {...props}>{children}</figcaption>
    ),
    blockquote: ({ children, ...props }: any) => (
      <blockquote {...props}>{children}</blockquote>
    ),
    code: ({ children, ...props }: any) => <code {...props}>{children}</code>,
    pre: ({ children, ...props }: any) => <pre {...props}>{children}</pre>,
    em: ({ children, ...props }: any) => <em {...props}>{children}</em>,
    strong: ({ children, ...props }: any) => (
      <strong {...props}>{children}</strong>
    ),
    small: ({ children, ...props }: any) => (
      <small {...props}>{children}</small>
    ),
    mark: ({ children, ...props }: any) => <mark {...props}>{children}</mark>,
    del: ({ children, ...props }: any) => <del {...props}>{children}</del>,
    ins: ({ children, ...props }: any) => <ins {...props}>{children}</ins>,
    sub: ({ children, ...props }: any) => <sub {...props}>{children}</sub>,
    sup: ({ children, ...props }: any) => <sup {...props}>{children}</sup>,
    time: ({ children, ...props }: any) => <time {...props}>{children}</time>,
    address: ({ children, ...props }: any) => (
      <address {...props}>{children}</address>
    ),
    cite: ({ children, ...props }: any) => <cite {...props}>{children}</cite>,
    q: ({ children, ...props }: any) => <q {...props}>{children}</q>,
    abbr: ({ children, ...props }: any) => <abbr {...props}>{children}</abbr>,
    dfn: ({ children, ...props }: any) => <dfn {...props}>{children}</dfn>,
    kbd: ({ children, ...props }: any) => <kbd {...props}>{children}</kbd>,
    samp: ({ children, ...props }: any) => <samp {...props}>{children}</samp>,
    var: ({ children, ...props }: any) => <var {...props}>{children}</var>,
    bdo: ({ children, ...props }: any) => <bdo {...props}>{children}</bdo>,
    bdi: ({ children, ...props }: any) => <bdi {...props}>{children}</bdi>,
    ruby: ({ children, ...props }: any) => <ruby {...props}>{children}</ruby>,
    rt: ({ children, ...props }: any) => <rt {...props}>{children}</rt>,
    rp: ({ children, ...props }: any) => <rp {...props}>{children}</rp>,
    wbr: ({ ...props }: any) => <wbr {...props} />,
    br: ({ ...props }: any) => <br {...props} />,
    hr: ({ ...props }: any) => <hr {...props} />,
    area: ({ ...props }: any) => <area {...props} />,
    base: ({ ...props }: any) => <base {...props} />,
    col: ({ ...props }: any) => <col {...props} />,
    embed: ({ ...props }: any) => <embed {...props} />,
    source: ({ ...props }: any) => <source {...props} />,
    track: ({ ...props }: any) => <track {...props} />,
    param: ({ ...props }: any) => <param {...props} />,
    meta: ({ ...props }: any) => <meta {...props} />,
    link: ({ ...props }: any) => <link {...props} />,
    title: ({ children, ...props }: any) => (
      <title {...props}>{children}</title>
    ),
    style: ({ children, ...props }: any) => (
      <style {...props}>{children}</style>
    ),
    script: ({ children, ...props }: any) => (
      <script {...props}>{children}</script>
    ),
    noscript: ({ children, ...props }: any) => (
      <noscript {...props}>{children}</noscript>
    ),
    template: ({ children, ...props }: any) => (
      <template {...props}>{children}</template>
    ),
    slot: ({ children, ...props }: any) => <slot {...props}>{children}</slot>,
    canvas: ({ children, ...props }: any) => (
      <canvas {...props}>{children}</canvas>
    ),
    map: ({ children, ...props }: any) => <map {...props}>{children}</map>,
    object: ({ children, ...props }: any) => (
      <object {...props}>{children}</object>
    ),
    iframe: ({ children, ...props }: any) => (
      <iframe {...props}>{children}</iframe>
    ),
    video: ({ children, ...props }: any) => (
      <video {...props}>{children}</video>
    ),
    audio: ({ children, ...props }: any) => (
      <audio {...props}>{children}</audio>
    ),
    picture: ({ children, ...props }: any) => (
      <picture {...props}>{children}</picture>
    ),
    dialog: ({ children, ...props }: any) => (
      <dialog {...props}>{children}</dialog>
    ),
    menu: ({ children, ...props }: any) => <menu {...props}>{children}</menu>,
    menuitem: ({ children, ...props }: any) => (
      <menuitem {...props}>{children}</menuitem>
    ),
    details: ({ children, ...props }: any) => (
      <details {...props}>{children}</details>
    ),
    summary: ({ children, ...props }: any) => (
      <summary {...props}>{children}</summary>
    ),
    datalist: ({ children, ...props }: any) => (
      <datalist {...props}>{children}</datalist>
    ),
    fieldset: ({ children, ...props }: any) => (
      <fieldset {...props}>{children}</fieldset>
    ),
    legend: ({ children, ...props }: any) => (
      <legend {...props}>{children}</legend>
    ),
    meter: ({ children, ...props }: any) => (
      <meter {...props}>{children}</meter>
    ),
    progress: ({ children, ...props }: any) => (
      <progress {...props}>{children}</progress>
    ),
    output: ({ children, ...props }: any) => (
      <output {...props}>{children}</output>
    ),
    keygen: ({ children, ...props }: any) => (
      <keygen {...props}>{children}</keygen>
    ),
    b: ({ children, ...props }: any) => <b {...props}>{children}</b>,
    i: ({ children, ...props }: any) => <i {...props}>{children}</i>,
    u: ({ children, ...props }: any) => <u {...props}>{children}</u>,
    s: ({ children, ...props }: any) => <s {...props}>{children}</s>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useMotionValue: vi.fn().mockReturnValue({ get: vi.fn(), set: vi.fn() }),
  useTransform: vi.fn().mockReturnValue({ get: vi.fn(), set: vi.fn() }),
  useSpring: vi.fn().mockReturnValue({ get: vi.fn(), set: vi.fn() }),
  useMotionValueEvent: vi.fn(),
  LazyMotion: ({ children }: any) => <>{children}</>,
  domAnimation: {},
  domMax: {},
  // 添加更多framer-motion的hooks和组件
  useAnimation: vi.fn().mockReturnValue({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn(),
  }),
  useCycle: vi.fn().mockReturnValue([vi.fn(), vi.fn()]),
  useReducedMotion: vi.fn().mockReturnValue(false),
  useInView: vi.fn().mockReturnValue([vi.fn(), false]),
  useScroll: vi.fn().mockReturnValue({
    scrollX: { get: vi.fn(), set: vi.fn() },
    scrollY: { get: vi.fn(), set: vi.fn() },
    scrollXProgress: { get: vi.fn(), set: vi.fn() },
    scrollYProgress: { get: vi.fn(), set: vi.fn() },
  }),
  usePresence: vi.fn().mockReturnValue([false, vi.fn()]),
  useDragControls: vi.fn().mockReturnValue({
    start: vi.fn(),
    stop: vi.fn(),
  }),
  usePanGesture: vi.fn().mockReturnValue({
    pan: vi.fn(),
    panStart: vi.fn(),
    panEnd: vi.fn(),
  }),
  useTapGesture: vi.fn().mockReturnValue({
    tap: vi.fn(),
    tapStart: vi.fn(),
    tapEnd: vi.fn(),
  }),
  useHoverGesture: vi.fn().mockReturnValue({
    hover: vi.fn(),
    hoverStart: vi.fn(),
    hoverEnd: vi.fn(),
  }),
  useFocusGesture: vi.fn().mockReturnValue({
    focus: vi.fn(),
    focusStart: vi.fn(),
    focusEnd: vi.fn(),
  }),
  useGesture: vi.fn().mockReturnValue({
    bind: vi.fn(),
  }),
  Reorder: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  ReorderGroup: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  ReorderItem: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  LayoutGroup: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
};

// React Spring Mock (如果项目中使用)
export const reactSpringMock = {
  useSpring: vi.fn().mockReturnValue({
    to: vi.fn(),
    from: vi.fn(),
    config: vi.fn(),
  }),
  useTransition: vi.fn().mockReturnValue([]),
  useTrail: vi.fn().mockReturnValue([]),
  useChain: vi.fn(),
  useSprings: vi.fn().mockReturnValue([]),
  animated: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    button: ({ children, ...props }: any) => (
      <button type="button" {...props}>
        {children}
      </button>
    ),
  },
  config: {
    default: {},
    gentle: {},
    wobbly: {},
    stiff: {},
    slow: {},
    molasses: {},
  },
};

// React Transition Group Mock (如果项目中使用)
export const reactTransitionGroupMock = {
  CSSTransition: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  TransitionGroup: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  SwitchTransition: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
};

// 设置动画相关的全局mock
export const setupAnimationMocks = () => {
  // 禁用CSS动画和过渡
  Object.defineProperty(document.body.style, 'animation', {
    value: 'none',
    writable: true,
  });

  Object.defineProperty(document.body.style, 'transition', {
    value: 'none',
    writable: true,
  });

  // Mock requestAnimationFrame 以加速测试
  global.requestAnimationFrame = vi.fn((callback) => {
    setTimeout(callback, 0);
    return 1;
  });

  global.cancelAnimationFrame = vi.fn();

  // Mock performance.now 以提供一致的时间
  global.performance = {
    ...global.performance,
    now: vi.fn().mockReturnValue(0),
  };
};
