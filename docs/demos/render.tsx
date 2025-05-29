import { MarkdownEditor } from '@ant-design/md-editor';
import { Card } from 'antd';
import React from 'react';
import { defaultValue } from './shared/defaultValue';

export default () => {
  return (
    <MarkdownEditor
      width={'100vw'}
      height={'100vh'}
      initValue={defaultValue}
      eleItemRender={(props, defaultDom) => {
        if (
          props.element.type !== 'table-cell' &&
          props.element.type !== 'table-row' &&
          props.element.type !== 'head' &&
          props.element.type !== 'card-before' &&
          props.element.type !== 'card-after'
        ) {
          return (
            <Card
              title={props.element.type}
              extra={<a href="#">More</a>}
              style={{
                marginBottom: 24,
              }}
              hoverable
            >
              {defaultDom}
            </Card>
          );
        }
        return defaultDom as React.ReactElement;
      }}
    />
  );
};
