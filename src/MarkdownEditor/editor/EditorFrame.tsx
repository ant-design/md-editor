import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { PhotoSlider } from 'react-photo-view';
import { Tab } from '..';
import { MEditor } from './Editor';
import { EditorStoreContext } from './store';
import { FloatBar } from './tools/FloatBar';
import { InsertAutocomplete } from './tools/InsertAutocomplete';
import { InsertLink } from './tools/InsertLink';
import { TableAttr } from './tools/TableAttr';

export const EditorFrame = observer(({ tab }: { tab: Tab }) => {
  if (!tab.current) return null as React.ReactNode;

  return (
    <EditorStoreContext.Provider value={tab.store}>
      <>
        <div className="content" style={{ flex: 1 }}>
          <MEditor note={tab.current} />
          <FloatBar />
          <InsertLink />
          <TableAttr />
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
      </>
    </EditorStoreContext.Provider>
  );
});
