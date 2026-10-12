import React, { useRef, useState } from 'react';
import { useSiteI18n } from '../../i18n';
import showroomImage1 from './assets/showroom-1.png';
import showroomImage2 from './assets/showroom-2.png';
import showroomImage3 from './assets/showroom-3.png';
import showroomImage4 from './assets/showroom-4.png';
import showroomImage5 from './assets/showroom-5.png';
import {
  CarouselCard,
  CarouselContainer,
  CarouselNavigation,
  CarouselNavigationButton,
  ComingSoonText,
  ComingSoonTitle,
  Container,
  CornerBracket,
  DiamondIcon,
  SectionWrapper,
  ShowroomCardImage,
  ShowroomSubtitle,
  ShowroomTitle,
  ShowroomTitleHighlight,
} from './style';

const showroomImages = [
  showroomImage1,
  showroomImage2,
  showroomImage3,
  showroomImage4,
  showroomImage5,
];

const INACTIVE_SCALE = 0.75;

const Showroom: React.FC = () => {
  const { messages } = useSiteI18n();
  const [activeIndex, setActiveIndex] = useState(2);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    let nextIndex = activeIndex;
    if (event.key === 'ArrowRight') {
      nextIndex = (activeIndex + 1) % showroomImages.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex =
        (activeIndex - 1 + showroomImages.length) % showroomImages.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = showroomImages.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    setActiveIndex(nextIndex);
    cardRefs.current[nextIndex]?.focus({ preventScroll: true });
  };

  return (
    <SectionWrapper>
      <Container>
        {/* Diamond Icon */}
        <DiamondIcon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
          >
            <path
              d="M0.00195312 12.1406C2.46307 13.7967 4.7351 15.6364 6.81804 17.6599C8.90099 19.6833 10.7949 21.8904 12.4996 24.2812C14.2044 21.8904 16.0983 19.6833 18.1812 17.6599C20.2642 15.6364 22.5362 13.7967 24.9973 12.1406C22.5362 10.4845 20.2642 8.64478 18.1812 6.62134C16.0983 4.59791 14.2044 2.3908 12.4996 0C10.7949 2.3908 8.90099 4.59791 6.81804 6.62134C4.7351 8.64478 2.46307 10.4845 0.00195312 12.1406Z"
              fill="#3066FD"
            />
          </svg>
        </DiamondIcon>

        {/* Subtitle */}
        <ShowroomSubtitle>{messages.showroom.subtitle}</ShowroomSubtitle>

        {/* Title */}
        <ShowroomTitle>
          {messages.showroom.titlePrefix}
          <ShowroomTitleHighlight>
            {messages.showroom.titleHighlight}
          </ShowroomTitleHighlight>
        </ShowroomTitle>

        {/* Carousel */}
        <CarouselContainer role="group" aria-label={messages.nav.showroom}>
          {/* 固定的四个角标 - 始终显示在中心位置 */}
          <CornerBracket $position="top-left">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="26"
              viewBox="0 0 25 26"
              fill="none"
            >
              <path
                d="M1 1V0H0V1H1ZM0 25V26H2V25H1H0ZM1 1V2H25V1V0H1V1ZM1 25H2V1H1H0V25H1Z"
                fill="white"
              />
            </svg>
          </CornerBracket>
          <CornerBracket $position="top-right">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="25"
              viewBox="0 0 26 25"
              fill="none"
            >
              <path
                d="M25 1L26 1L26 4.37114e-08L25 0L25 1ZM1 -1.04907e-06L4.37114e-08 -1.09278e-06L-4.37114e-08 2L1 2L1 0.999999L1 -1.04907e-06ZM25 1L24 1L24 25L25 25L26 25L26 1L25 1ZM1 0.999999L1 2L25 2L25 1L25 0L1 -1.04907e-06L1 0.999999Z"
                fill="white"
              />
            </svg>
          </CornerBracket>
          <CornerBracket $position="bottom-left">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="26"
              viewBox="0 0 25 26"
              fill="none"
            >
              <path
                d="M1 25V26H0V25H1ZM0 1V0H2V1H1H0ZM1 25V24H25V25V26H1V25ZM1 1H2V25H1H0V1H1Z"
                fill="white"
              />
            </svg>
          </CornerBracket>
          <CornerBracket $position="bottom-right">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
            >
              <path
                d="M25 1L25 25L1 25"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="square"
              />
            </svg>
          </CornerBracket>

          {/* 卡片列表 */}
          {showroomImages.map((image, index) => {
            const isActive = index === activeIndex;
            const relativeIndex = index - activeIndex;

            const distance = Math.abs(relativeIndex);
            // Keep the active card centered; CSS variables also size mobile cards.
            const widthOffset =
              relativeIndex === 0
                ? 0
                : Math.sign(relativeIndex) *
                  (distance * INACTIVE_SCALE + (1 - INACTIVE_SCALE) / 2);
            const scale = isActive ? 1 : INACTIVE_SCALE;
            const opacity = isActive
              ? 1
              : Math.max(0.5, 0.65 - distance * 0.08);

            return (
              <CarouselCard
                key={index}
                type="button"
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
                aria-label={`${messages.nav.showroom} ${index + 1}`}
                aria-pressed={isActive}
                tabIndex={isActive ? 0 : -1}
                onKeyDown={handleCardKeyDown}
                onClick={() => setActiveIndex(index)}
                style={{
                  transform: `translate3d(calc(-50% + var(--showroom-card-width) * ${widthOffset} + var(--showroom-card-gap) * ${relativeIndex}), 0, 0) scale(${scale})`,
                  zIndex: isActive ? 10 : 5 - distance,
                  opacity,
                }}
              >
                <ShowroomCardImage
                  src={image}
                  alt=""
                  draggable={false}
                  decoding="async"
                />
              </CarouselCard>
            );
          })}
        </CarouselContainer>
        <CarouselNavigation role="group" aria-label={messages.nav.showroom}>
          {showroomImages.map((image, index) => (
            <CarouselNavigationButton
              key={image}
              type="button"
              aria-label={`${messages.nav.showroom} ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </CarouselNavigation>

        {/* Coming Soon */}
        <ComingSoonTitle>{messages.showroom.comingSoonTitle}</ComingSoonTitle>
        <ComingSoonText>{messages.showroom.comingSoonText}</ComingSoonText>
      </Container>
    </SectionWrapper>
  );
};

export default Showroom;
