import { Avatar, Tooltip } from 'antd';
import React from 'react';

type AvatarListItem = {
  name: string;
  collaboratorNumber: number;
};
interface ContributorAvatarProps {
  loading?: boolean;
  item?: AvatarListItem;
  index?: number;
}

const COLOR_LIST = [
  '#f56a00',
  '#7265e6',
  '#ffbf00',
  '#00a2ae',
  '#f44336',
  '#87d068',
];

export const ContributorAvatar: React.FC<ContributorAvatarProps> = (props) => {
  const { item: { name } = {}, index = 0 } = props;
  return (
    <Tooltip title={name}>
      <div className="avatar_list_item">
        <Avatar
          size={14}
          alt={name}
          style={{
            backgroundColor: COLOR_LIST[index % COLOR_LIST.length],
            cursor: 'pointer',
          }}
        >
          {name?.slice(0, 2)}
        </Avatar>
      </div>
    </Tooltip>
  );
};

export const AvatarList: React.FC<{
  displayList: AvatarListItem[];
  style?: React.CSSProperties;
}> = ({ displayList, style }) => {
  return (
    <>
      <div
        className="avatar_list"
        style={{
          display: 'flex',
          boxSizing: 'border-box',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          flexFlow: 'wrap',
          ...style,
        }}
      >
        {displayList.map((item, index) => {
          return (
            <ContributorAvatar key={item.name} item={item} index={index} />
          );
        })}
      </div>
    </>
  );
};
