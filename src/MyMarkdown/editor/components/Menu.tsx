/* eslint-disable @typescript-eslint/no-use-before-define */
import { Menu as AntMenu } from 'antd';
import { MenuItemType } from 'antd/es/menu/interface';
import { observer } from 'mobx-react-lite';
import React, {
  MutableRefObject,
  ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createRoot } from 'react-dom/client';
import { getOffsetLeft, getOffsetTop } from '../utils/dom';
import { useLocalState } from '../utils/useLocalState';

const Menu = observer(
  (props: {
    e?: MouseEvent | React.MouseEvent;
    parent?: HTMLDivElement;
    menus: IMenu[];
    root: HTMLDivElement;
    onClose?: (e: React.MouseEvent) => void;
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [state, setState] = useLocalState({
      x: 0,
      y: 0,
    });
    useLayoutEffect(() => {
      const dom = ref.current!;
      if (props.e) {
        let x = props.e.pageX,
          y = props.e.pageY;
        if (x + dom.clientWidth > window.innerWidth && x - dom.clientWidth > 0)
          x -= dom.clientWidth;
        if (
          y + dom.clientHeight > window.innerHeight &&
          y - dom.clientHeight > 0
        )
          y -= dom.clientHeight;
        setState({ x, y });
      }
      if (props.parent) {
        let left = props.parent.clientWidth - 2;
        let top = -5;
        const offsetLeft = getOffsetLeft(props.parent, props.root);
        const offsetTop = getOffsetTop(props.parent, props.root);
        if (
          offsetLeft + dom.clientWidth + props.parent.clientWidth >
            window.innerWidth &&
          offsetLeft - dom.clientWidth > 0
        ) {
          left = -dom.clientWidth - 2;
        }
        if (
          offsetTop + dom.clientHeight - 5 > window.innerHeight &&
          offsetTop - dom.clientHeight + props.parent.clientHeight > 0
        ) {
          top = -dom.clientHeight + props.parent.clientHeight + 5;
        }
        setState({ x: left, y: top });
      }
    }, [props.parent]);
    return (
      <div
        ref={ref}
        style={{ left: state.x, top: state.y, zIndex: 10 }}
        className={`context-menu`}
      >
        <MenuRender menus={props.menus} root={props.root} boxRef={ref} />
      </div>
    );
  },
);

export type IMenu = {
  text?: string | ReactNode;
  type?: string;
  hr?: boolean;
  click?: any;
  key?: string;
  disabled?: boolean;
  children?: IMenu[];
  role?: string[];
};

const MenuRender = observer(
  (props: {
    top?: boolean;
    menus: IMenu[];
    root: HTMLDivElement;
    boxRef: MutableRefObject<HTMLDivElement | null>;
  }) => {
    const menusToItems = (menus: IMenu[]): MenuItemType[] => {
      return menus.map(
        (m) =>
          ({
            click: m.click,
            label: m.hr ? null : m.text,
            type: m.hr ? 'divider' : undefined,
            children: m.children ? menusToItems(m.children) : undefined,
            key: m.key,
            disabled: m.disabled,
          } as MenuItemType),
      ) as MenuItemType[];
    };
    return <AntMenu items={menusToItems(props.menus)}></AntMenu>;
  },
);

const Entry = observer(
  (props: {
    onClose: () => void;
    e: MouseEvent | React.MouseEvent;
    menus: IMenu[];
    root: HTMLDivElement;
    onCallback?: () => void;
  }) => {
    const [show, setShow] = useState(true);
    return (
      <div
        style={{
          pointerEvents: 'auto',
          inset: 0,
          position: 'fixed',
          zIndex: 2000,
          display: show ? 'block' : 'none',
        }}
        onClick={(e) => {
          e.stopPropagation();
          setShow(false);
          props.onCallback?.();
          setTimeout(() => {
            props.onClose();
          }, 200);
        }}
      >
        <Menu e={props.e} root={props.root} menus={props.menus} />
      </div>
    );
  },
);
export const openMenus = (
  e: MouseEvent | React.MouseEvent,
  menus: IMenu[],
  cb?: () => void,
) => {
  const div = window.document.createElement('div');
  const root = createRoot(div);
  window.document.body.append(div);
  div.onmousedown = (e) => e.preventDefault();
  root.render(
    <Entry
      e={e}
      menus={menus}
      root={div}
      onCallback={cb}
      onClose={() => {
        root.unmount();
        window.document.body.removeChild(div);
      }}
    />,
  );
};
