import React from 'react';
import { MarkdownEditor } from '../../src/MarkdownEditor';

/**
 * 评论功能高亮演示
 *
 * 此演示展示了在报告模式下的评论功能，特别是高亮评论类型的使用。
 * 功能包括：
 * 1. 文本高亮选择
 * 2. 评论标记显示
 * 3. 只读模式下的评论查看
 * 4. @提及功能支持
 */
export default () => {
  const [commentList, setCommentList] = React.useState<any[]>([
    {
      selection: {
        anchor: {
          path: [1, 0],
          offset: 19,
        },
        focus: {
          path: [1, 0],
          offset: 28,
        },
      },
      path: [1, 0],
      time: 1757562229525,
      id: 1757562229525,
      content: '',
      anchorOffset: 19,
      focusOffset: 28,
      refContent: '',
      commentType: 'highlight',
    },
    {
      selection: {
        anchor: {
          path: [11, 0, 0, 0],
          offset: 0,
        },
        focus: {
          path: [11, 0, 0, 0],
          offset: 6,
        },
      },
      path: [11, 0, 0, 0],
      time: 1757562256636,
      id: 1757562256636,
      content: '',
      anchorOffset: 0,
      focusOffset: 6,
      refContent: '',
      commentType: 'highlight',
    },
    {
      selection: {
        anchor: {
          path: [8, 0, 0, 1],
          offset: 1,
        },
        focus: {
          path: [8, 0, 0, 1],
          offset: 9,
        },
      },
      path: [8, 0, 0, 1],
      time: 1757562274794,
      id: 1757562274794,
      content: '',
      anchorOffset: 1,
      focusOffset: 9,
      refContent: '',
      commentType: 'highlight',
    },
  ]);
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>
          📝 评论功能高亮演示
        </h1>
        <div
          style={{
            backgroundColor: '#f6f8fa',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #d1d9e0',
          }}
        >
          <h3 style={{ margin: '0 0 12px 0', color: '#0366d6' }}>
            ✨ 功能特性
          </h3>
          <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>
              <strong>文本高亮</strong>：选中文本进行高亮标记
            </li>
            <li>
              <strong>评论支持</strong>：对高亮内容添加评论
            </li>
            <li>
              <strong>报告模式</strong>：只读状态下的文档审阅
            </li>
            <li>
              <strong>@提及功能</strong>：支持@其他用户进行协作
            </li>
            <li>
              <strong>评论管理</strong>：查看、编辑、删除评论
            </li>
          </ul>
        </div>

        <div
          style={{
            backgroundColor: '#fff3cd',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            border: '1px solid #ffeaa7',
          }}
        >
          <strong>💡 使用说明：</strong>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            <li>此演示处于只读模式，展示评论高亮效果</li>
            <li>高亮区域以特殊颜色标记，表示有评论内容</li>
            <li>实际使用中，用户可以选择文本添加评论</li>
            <li>支持多种评论类型：普通评论、高亮标记等</li>
          </ul>
        </div>
      </div>

      <div
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <MarkdownEditor
          initValue={`# 评论功能示例
这是一个支持评论的文档。在报告模式下，用户可以对文档内容进行评论。

## 如何使用评论功能
1. 选中要评论的文本
2. 点击出现的评论按钮
3. 输入评论内容
4. 支持@提及其他用户

> 评论功能常用于文档审阅、协作编辑等场景。

## 应用场景

### 📋 文档审阅
在团队协作中，评论功能可以帮助：
- **内容审核**：对文档内容进行详细审查
- **意见反馈**：针对特定段落提出建议
- **问题标注**：标记需要修改或讨论的内容
- **知识分享**：添加补充说明和相关信息

### 🔍 质量控制
评论系统支持：
- 多人同时审阅
- 实时评论同步
- 评论状态跟踪
- 历史记录查看

### 💬 协作沟通
通过评论功能可以：
- @提及相关同事
- 创建讨论线程
- 跟踪处理进度
- 保持沟通记录`}
          readonly
          reportMode
          className="chunk-content-editor"
          style={{
            minHeight: '600px',
            border: 'none',
          }}
          comment={{
            enable: true,
            commentList: commentList,
            loadMentions: async () => {
              return [
                {
                  name: '张三',
                  avatar:
                    'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                },
                {
                  name: '李四',
                  avatar:
                    'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                },
                {
                  name: '王五',
                  avatar:
                    'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                },
                {
                  name: '赵六',
                  avatar:
                    'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                },
              ];
            },
            onDelete: async (id) => {
              console.log('删除评论:', id);
            },
            onSubmit: async (id, data) => {
              setCommentList((prev) => {
                const index = prev.findIndex((item) => item.id === id);
                if (index !== -1) {
                  const newList = [...prev];
                  newList[index] = {
                    ...newList[index],
                    ...data,
                  };
                  return newList;
                }
                return [...prev, { ...data, id }];
              });
              console.log('提交评论:', id, data);
            },
          }}
        />
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
        }}
      >
        <h3 style={{ margin: '0 0 12px 0' }}>🔧 技术实现</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            fontSize: '14px',
          }}
        >
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#495057' }}>
              Props 配置：
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li>
                <code>readonly</code>: 只读模式
              </li>
              <li>
                <code>reportMode</code>: 报告模式
              </li>
              <li>
                <code>comment.enable</code>: 启用评论功能
              </li>
              <li>
                <code>comment.commentList</code>: 评论数据列表
              </li>
              <li>
                <code>comment.loadMentions</code>: 加载@提及用户
              </li>
            </ul>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#495057' }}>
              评论类型：
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li>
                <code>highlight</code>: 高亮标记类型
              </li>
              <li>
                <code>comment</code>: 普通评论类型
              </li>
              <li>
                <code>selection</code>: 选择区域信息
              </li>
              <li>
                <code>refContent</code>: 引用的原文内容
              </li>
              <li>
                <code>user</code>: 评论用户信息
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#e7f3ff',
          borderRadius: '6px',
          border: '1px solid #91d5ff',
          fontSize: '13px',
          color: '#003a8c',
        }}
      >
        <strong>💡 开发提示：</strong>
        在实际项目中，可以结合后端 API
        实现评论的持久化存储、实时同步、权限控制等高级功能。
        评论数据结构支持扩展，可以添加更多自定义字段满足业务需求。
      </div>
    </div>
  );
};
