/**
 * @fileoverview HTML预览模态框组件
 * 负责显示HTML代码的执行结果
 */

import { Modal } from 'antd';
import React from 'react';

interface HtmlPreviewProps {
  htmlStr: string;
  onClose: () => void;
}

export function HtmlPreview({ htmlStr, onClose }: HtmlPreviewProps) {
  return (
    <Modal
      data-testid="html-preview-modal"
      open={!!htmlStr}
      destroyOnHidden
      title="HTML执行结果"
      footer={null}
      styles={{
        body: {
          padding: 0,
          margin: 0,
          boxSizing: 'border-box',
        },
      }}
      width="80vw"
      onCancel={onClose}
      afterClose={onClose}
    >
      <iframe
        data-testid="html-preview-iframe"
        style={{
          outline: 0,
          border: 'none',
          height: '60vh',
        }}
        width="100%"
        srcDoc={htmlStr}
      />
    </Modal>
  );
}
