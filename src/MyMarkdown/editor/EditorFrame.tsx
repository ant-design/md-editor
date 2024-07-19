import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useLayoutEffect, useMemo } from 'react';
import { PhotoSlider } from 'react-photo-view';
import { Tab } from '..';
import { MEditor } from './Editor';
import { EditorStoreContext } from './store';
import { FloatBar } from './tools/FloatBar';
import { InsertAutocomplete } from './tools/InsertAutocomplete';
import { InsertLink } from './tools/InsertLink';
import { LangAutocomplete } from './tools/LangAutocomplete';
import { Heading } from './tools/Leading';
import { TableAttr } from './tools/TableAttr';
import { getImageData } from './utils';
import { mediaType } from './utils/dom';

export const EditorFrame = observer(({ tab }: { tab: Tab }) => {
  const mt = useMemo(
    () => mediaType(tab.current?.filePath || ''),
    [tab.current],
  );
  useLayoutEffect(() => {
    tab.store.openFilePath = tab.current?.filePath || null;
  }, [tab.current?.filePath]);

  const size = useMemo(() => {
    if (typeof window === 'undefined') return { width: 600, height: 300 };
    return {
      width: window.innerWidth,
      height: window.innerHeight - 40,
    };
  }, []);
  const pt = 0;

  if (!tab.current) return null;

  return (
    <EditorStoreContext.Provider value={tab.store}>
      <>
        <div className="content">
          <MEditor note={tab.current} />
          {mt !== 'other' && mt !== 'markdown' && (
            <>
              {mt === 'image' ? (
                <div style={{ paddingTop: pt + 20 }}>
                  <img
                    src={getImageData(tab.current?.filePath)}
                    alt=""
                    className={'block'}
                  />
                </div>
              ) : (
                <div
                  style={{
                    ...size,
                    paddingTop: pt + 20,
                  }}
                  className={'px-10 pb-5'}
                >
                  <iframe
                    className={
                      'w-full h-full overflow-y-auto rounded border b1'
                    }
                    src={tab.current.filePath}
                  />
                </div>
              )}
            </>
          )}
          <FloatBar />
          <InsertLink />
          <TableAttr />
          <LangAutocomplete />
          <InsertAutocomplete />
          <PhotoSlider
            maskOpacity={0.5}
            className={'desktop-img-view'}
            images={tab.store.viewImages.map((src) => ({ src, key: src }))}
            visible={tab.store.openViewImage}
            onClose={action(() => (tab.store.openViewImage = false))}
            index={tab.store.viewImageIndex}
            onIndexChange={action(
              (i: number) => (tab.store.viewImageIndex = i),
            )}
          />
        </div>
        {tab && <Heading note={tab.current} />}
      </>
    </EditorStoreContext.Provider>
  );
});
