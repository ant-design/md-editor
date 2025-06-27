import classNames from 'classnames';
import React from 'react';

export type RobotStatus = 'default' | 'thinking' | 'dazing';

export interface RobotProps {
  /** 机器人状态 */
  status?: RobotStatus;
  /** 机器人大小 */
  size?: number;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  icon?: React.ReactNode;
}

const Robot: React.FC<RobotProps> = ({ icon, size = 42, className, style }) => {
  return (
    <div
      className={classNames(className)}
      style={
        React.isValidElement(icon)
          ? {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              marginRight: 8,
              ...style,
            }
          : {
              width: size,
              height: size,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              marginRight: 8,
              ...style,
            }
      }
    >
      {React.isValidElement(icon) ? (
        icon
      ) : (
        <img
          style={{
            width: '100%',
            height: '100%',
          }}
          src={
            (icon as string) ||
            'https://mdn.alipayobjects.com/huamei_re70wt/afts/img/A*R2VDRJQuQd4AAAAAAAAAAAAADmuEAQ/original'
          }
          alt="robot"
        />
      )}
    </div>
  );
};

export default React.memo(Robot);
