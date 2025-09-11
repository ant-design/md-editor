import React from 'react';
import { DonutChartData } from './types';
import { MOBILE_MAX_CHART_SIZE } from './constants';

export const useMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [windowWidth, setWindowWidth] = React.useState(0);

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsMobile(width <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile, windowWidth } as const;
};

export const useResponsiveDimensions = (
  isMobile: boolean,
  windowWidth: number,
  width: number,
  height: number,
) => {
  if (isMobile) {
    const mobileWidth = Math.min(windowWidth - 40, width, MOBILE_MAX_CHART_SIZE);
    const mobileHeight = Math.min(
      windowWidth - 40,
      height,
      MOBILE_MAX_CHART_SIZE,
    );
    return {
      width: mobileWidth,
      height: mobileHeight,
      chartWidth: mobileWidth,
      chartHeight: mobileHeight,
    } as const;
  }
  return {
    width,
    height,
    chartWidth: width,
    chartHeight: height,
  } as const;
};

export const useFilterLabels = (data: DonutChartData[]) => {
  const validFilterLables = React.useMemo(() => {
    return data
      .map((item) => item.filterLable)
      .filter(
        (filterLable): filterLable is string => filterLable !== undefined,
      );
  }, [data]);

  const filterLables = React.useMemo(() => {
    return validFilterLables.length > 0
      ? [...new Set(validFilterLables)]
      : undefined;
  }, [validFilterLables]);

  const [selectedFilterLable, setSelectedFilterLable] = React.useState(
    filterLables && filterLables.length > 0 ? filterLables[0] : undefined,
  );

  const filteredDataByFilterLable = React.useMemo(() => {
    return filterLables?.map((item) => ({ key: item, label: item }));
  }, [filterLables]);

  return {
    filterLables,
    filteredDataByFilterLable,
    selectedFilterLable,
    setSelectedFilterLable,
  } as const;
};

export const useAutoCategory = (
  data: DonutChartData[],
  enableAutoCategory: boolean,
  externalSelectedFilter?: string,
) => {
  const autoCategoryData = React.useMemo(() => {
    if (!enableAutoCategory || !data) {
      return null;
    }

    const allData = data;
    const categories = [
      ...new Set(allData.map((item) => item.category).filter(Boolean)),
    ];

    if (categories.length <= 1) {
      return null;
    }

    return {
      categories,
      allData,
    } as const;
  }, [data, enableAutoCategory]);

  const [internalSelectedCategory, setInternalSelectedCategory] =
    React.useState<string>('');

  React.useEffect(() => {
    if (autoCategoryData && !internalSelectedCategory) {
      setInternalSelectedCategory(
        autoCategoryData.categories.find(Boolean) || '',
      );
    }
  }, [autoCategoryData, internalSelectedCategory]);

  const selectedCategory = externalSelectedFilter || internalSelectedCategory;

  return {
    autoCategoryData,
    internalSelectedCategory,
    setInternalSelectedCategory,
    selectedCategory,
  } as const;
}; 
