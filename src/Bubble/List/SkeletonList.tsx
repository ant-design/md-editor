import { Flex, Skeleton } from 'antd';
import React, { memo } from 'react';

const SkeletonList = memo(() => {
  return (
    <Flex gap={24} vertical>
      <Skeleton
        active
        avatar={{ size: 32 }}
        paragraph={{ width: ['50%', '30%'] }}
        title={false}
      />
      <Skeleton
        active
        avatar={{ size: 32 }}
        paragraph={{ width: ['50%', '30%'] }}
        title={false}
        style={{ transform: 'rotate(180deg)' }}
      />
    </Flex>
  );
});
export default SkeletonList;
