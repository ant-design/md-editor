import { VisualList, VisualListItem } from '@ant-design/md-editor';
import React from 'react';

const mockData: VisualListItem[] = [
  {
    title: 'afc163',
    src: 'https://avatars.githubusercontent.com/u/507615?s=40&v=4',
  },
  {
    title: 'li-jia-nan',
    src: 'https://avatars.githubusercontent.com/u/49217418?s=40&v=4',
  },
  {
    title: 'MadCcc',
    src: 'https://avatars.githubusercontent.com/u/27722486?s=40&v=4',
  },
  {
    title: 'zombieJ',
    src: 'https://avatars.githubusercontent.com/u/5378891?s=40&v=4',
  },
  {
    title: 'benjycui',
    src: 'https://avatars.githubusercontent.com/u/3580607?s=40&v=4',
  },
  {
    title: 'ycjcl868',
    src: 'https://avatars.githubusercontent.com/u/13595509?s=40&v=4',
  },
  {
    title: 'coding-ice',
    src: 'https://avatars.githubusercontent.com/u/49827327?s=40&v=4',
  },
  {
    title: 'yesmeck',
    src: 'https://avatars.githubusercontent.com/u/465125?s=40&v=4',
  },
  {
    title: 'xrkffgg',
    src: 'https://avatars.githubusercontent.com/u/29775873?s=40&v=4',
  },
  {
    title: 'hengkx',
    src: 'https://avatars.githubusercontent.com/u/8358236?s=40&v=4',
  },
  {
    title: 'Wxh16144',
    src: 'https://avatars.githubusercontent.com/u/32004925?s=40&v=4',
  },
  {
    title: 'kiner-tang',
    src: 'https://avatars.githubusercontent.com/u/10286961?s=40&v=4',
  },
  {
    title: 'arvinxx',
    src: 'https://avatars.githubusercontent.com/u/28616219?s=40&v=4',
  },
  {
    title: 'ilanus',
    src: 'https://avatars.githubusercontent.com/u/9677898?s=40&v=4',
  },
  {
    title: 'yoyo837',
    src: 'https://avatars.githubusercontent.com/u/6134547?s=40&v=4',
  },
  {
    title: 'PeachScript',
    src: 'https://avatars.githubusercontent.com/u/5035925?s=40&v=4',
  },
  {
    title: 'xiao11lang',
    src: 'https://avatars.githubusercontent.com/u/33827620?s=40&v=4',
  },
  {
    title: 'zhangyanling77',
    src: 'https://avatars.githubusercontent.com/u/19699453?s=40&v=4',
  },
  {
    title: 'TrickyPi',
    src: 'https://avatars.githubusercontent.com/u/33021497?s=40&v=4',
  },
  {
    title: 'zhangchao-wooc',
    src: 'https://avatars.githubusercontent.com/u/56663373?s=40&v=4',
  },
  {
    title: 'crazyair',
    src: 'https://avatars.githubusercontent.com/u/7971419?s=40&v=4',
  },
  {
    title: 'snow-monster',
    src: 'https://avatars.githubusercontent.com/u/20292202?s=40&v=4',
  },
  {
    title: 'leixd1994',
    src: 'https://avatars.githubusercontent.com/u/23328517?s=40&v=4',
  },
  {
    title: 'Meet-student',
    src: 'https://avatars.githubusercontent.com/u/59312002?s=40&v=4',
  },
  {
    title: 'aojunhao123',
    src: 'https://avatars.githubusercontent.com/u/82765353?s=40&v=4',
  },
  {
    title: 'zeroslope',
    src: 'https://avatars.githubusercontent.com/u/10218146?s=40&v=4',
  },
  {
    title: 'shifenhutu',
    src: 'https://avatars.githubusercontent.com/u/104620424?s=40&v=4',
  },
  {
    title: 'user-xxy',
    src: 'https://avatars.githubusercontent.com/u/55080157?s=40&v=4',
  },
  {
    title: 'vagusX',
    src: 'https://avatars.githubusercontent.com/u/6828924?s=40&v=4',
  },
  {
    title: 'AshoneA',
    src: 'https://avatars.githubusercontent.com/u/22393991?s=40&v=4',
  },
  {
    title: 'WynterDing',
    src: 'https://avatars.githubusercontent.com/u/11213298?s=40&v=4',
  },
  {
    title: 'heiyu4585',
    src: 'https://avatars.githubusercontent.com/u/10607168?s=40&v=4',
  },
  {
    title: 'zqran',
    src: 'https://avatars.githubusercontent.com/u/15389209?s=40&v=4',
  },
  {
    title: 'chenshuai2144',
    src: 'https://avatars.githubusercontent.com/u/8186664?s=40&v=4',
  },
  {
    title: 'OysterD3',
    src: 'https://avatars.githubusercontent.com/u/7383278?s=40&v=4',
  },
  {
    title: 'yanceyou',
    src: 'https://avatars.githubusercontent.com/u/16320418?s=40&v=4',
  },
  {
    title: 'muzea',
    src: 'https://avatars.githubusercontent.com/u/7843281?s=40&v=4',
  },
  {
    title: 'jaredleechn',
    src: 'https://avatars.githubusercontent.com/u/5318333?s=40&v=4',
  },
  {
    title: 'itellboy',
    src: 'https://avatars.githubusercontent.com/u/17695267?s=40&v=4',
  },
  {
    title: 'yingxirz',
    src: 'https://avatars.githubusercontent.com/u/24960043?s=40&v=4',
  },
  {
    title: 'GeorgeHcc',
    src: 'https://avatars.githubusercontent.com/u/72842677?s=40&v=4',
  },
  {
    title: 'ddcat1115',
    src: 'https://avatars.githubusercontent.com/u/7017767?s=40&v=4',
  },
  {
    title: 'waywardmonkeys',
    src: 'https://avatars.githubusercontent.com/u/178582?s=40&v=4',
  },
];
export default () => {
  return (
    <div style={{ padding: 24 }}>
      <h3>基础用法</h3>
      <VisualList data={mockData} />

      <h3 style={{ marginTop: 24 }}>描述</h3>
      <VisualList
        data={mockData}
        shape="circle"
        description={`${mockData.length}个成员`}
      />

      <div style={{ marginTop: '20px' }}>
        <h4>Props 说明：</h4>
        <ul>
          <li>
            <strong>data</strong>: 图片数据数组，必需参数
          </li>
          <li>
            <strong>shape</strong>: 图片形状，可选 'default'、'circle'
          </li>
          <li>
            <strong>filter</strong>: 数据过滤函数，用于筛选显示的图片
          </li>
          <li>
            <strong>href</strong>: 如果提供，图片将变为可点击的链接
          </li>
        </ul>
      </div>
    </div>
  );
};
