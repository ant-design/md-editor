// tests/MarkdownEditor/empty.test.tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import React from 'react';
import { Table } from 'antd';

describe('Ant Design Table in test', () => {
  it('renders Ant Design Table with provided data', () => {
    // 定义 Table 数据源和列
    const dataSource = [
      {
        key: '1',
        name: 'John Doe',
        age: 32,
        address: '10 Downing Street',
      },
      {
        key: '2',
        name: 'Jane Smith',
        age: 28,
        address: '11 Downing Street',
      },
    ];

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
      },
    ];

    // 渲染 Table 组件
    render(<Table dataSource={dataSource} columns={columns} />);

    // 验证是否渲染了表格内容
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
 
  });
});
