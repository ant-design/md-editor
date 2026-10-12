import React, { useContext } from 'react';
import { BacksideCard } from '../../BacksideCard';
import { CardAnimationContext } from '../../CardAnimationContext';
import { FeatureItem } from '../types';
import { CardBack } from './style';

interface DefaultBacksideCardProps {
  feature: FeatureItem;
  themeColor: string;
}

export const DefaultBacksideCard: React.FC<DefaultBacksideCardProps> = ({
  feature,
  themeColor,
}) => {
  const { backActive } = useContext(CardAnimationContext);
  return (
    <CardBack $borderColor={themeColor} aria-hidden={!backActive}>
      <BacksideCard feature={feature} color={themeColor} />
    </CardBack>
  );
};
