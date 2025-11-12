import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { VoiceButton } from '../../src/Bubble/MessagesContent/VoiceButton';

// Mock useSpeechSynthesis hook
const mockUseSpeechSynthesis = vi.fn();

// Mock animated icons
vi.mock('../../src/Icons/animated/VoicePlayLottie', () => ({
  default: ({ size }: { size: number }) => (
    <div data-testid="voice-play-lottie" style={{ width: size, height: size }} />
  ),
}));

vi.mock('../../src/Icons/animated/VoicingLottie', () => ({
  default: ({ size }: { size: number }) => (
    <div data-testid="voicing-lottie" style={{ width: size, height: size }} />
  ),
}));

// Mock sofa-design icons
vi.mock('@sofa-design/icons', () => ({
  Play: () => <div data-testid="play-icon" />,
  Pause: () => <div data-testid="pause-icon" />,
  ChevronDown: () => <div data-testid="chevron-down-icon" />,
}));

// Mock antd components
vi.mock('antd', () => ({
  ConfigProvider: {
    ConfigContext: {
      Provider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
      Consumer: ({ children }: { children: (value: any) => React.ReactNode }) => 
        children({ getPrefixCls: (prefix: string) => `ant-${prefix}` }),
    },
  },
  Dropdown: ({ children, menu }: any) => (
    <div data-testid="dropdown">
      {children}
      {menu?.items?.map((item: any) => (
        <div
          key={item.key}
          data-testid={`dropdown-item-${item.key}`}
          onClick={() => menu?.onClick?.({ key: item.key })}
        >
          {item.label}
        </div>
      ))}
    </div>
  ),
  Flex: ({ children, ...props }: any) => (
    <div data-testid="flex" {...props}>
      {children}
    </div>
  ),
  Tooltip: ({ children, title }: any) => (
    <div data-testid="tooltip" title={title}>
      {children}
    </div>
  ),
}));

// Mock useStyle hook
vi.mock('../../src/Bubble/MessagesContent/VoiceButton/style', () => ({
  useStyle: () => ({
    wrapSSR: (node: React.ReactNode) => node,
    hashId: '',
  }),
}));

describe('VoiceButton', () => {
  const defaultProps = {
    text: 'Hello, world!',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to default mock implementation
    mockUseSpeechSynthesis.mockImplementation(() => ({
      isSupported: true,
      isPlaying: false,
      rate: 1,
      setRate: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
    }));
  });

  describe('基本渲染测试', () => {
    it('应该正确渲染VoiceButton', () => {
      render(<VoiceButton {...defaultProps} />);

      expect(screen.getByLabelText('语音播报')).toBeInTheDocument();
    });

    it('应该在不支持语音时显示相应提示', () => {
      mockUseSpeechSynthesis.mockImplementation(() => ({
        isSupported: false,
        isPlaying: false,
        rate: 1,
        setRate: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        pause: vi.fn(),
        resume: vi.fn(),
      }));

      render(<VoiceButton {...defaultProps} />);

      const button = screen.getByLabelText('语音播报');
      expect(button).toBeInTheDocument();
      expect(screen.getByTestId('tooltip')).toHaveAttribute(
        'title',
        '当前环境不支持语音播报',
      );
    });
  });

  describe('播放功能测试', () => {
    it('应该在点击播放按钮时调用start方法', () => {
      const mockStart = vi.fn();
      mockUseSpeechSynthesis.mockImplementation(() => ({
        isSupported: true,
        isPlaying: false,
        rate: 1,
        setRate: vi.fn(),
        start: mockStart,
        stop: vi.fn(),
        pause: vi.fn(),
        resume: vi.fn(),
      }));

      render(<VoiceButton {...defaultProps} />);

      const playButton = screen.getByLabelText('语音播报');
      fireEvent.click(playButton);

      expect(mockStart).toHaveBeenCalled();
    });

    it('应该在播放时显示停止按钮', () => {
      mockUseSpeechSynthesis.mockImplementation(() => ({
        isSupported: true,
        isPlaying: true,
        rate: 1,
        setRate: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        pause: vi.fn(),
        resume: vi.fn(),
      }));

      render(<VoiceButton {...defaultProps} />);

      expect(screen.getByLabelText('停止播报')).toBeInTheDocument();
      expect(screen.getByTestId('voicing-lottie')).toBeInTheDocument();
    });

    it('应该在点击停止按钮时调用stop方法', () => {
      const mockStop = vi.fn();
      mockUseSpeechSynthesis.mockImplementation(() => ({
        isSupported: true,
        isPlaying: true,
        rate: 1,
        setRate: vi.fn(),
        start: vi.fn(),
        stop: mockStop,
        pause: vi.fn(),
        resume: vi.fn(),
      }));

      render(<VoiceButton {...defaultProps} />);

      const stopButton = screen.getByLabelText('停止播报');
      fireEvent.click(stopButton);

      expect(mockStop).toHaveBeenCalled();
    });
  });

  describe('倍速控制测试', () => {
    it('应该渲染倍速选项', () => {
      mockUseSpeechSynthesis.mockImplementation(() => ({
        isSupported: true,
        isPlaying: true,
        rate: 1,
        setRate: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        pause: vi.fn(),
        resume: vi.fn(),
      }));

      render(<VoiceButton {...defaultProps} />);

      // Check that rate options are rendered
      expect(screen.getByTestId('dropdown')).toBeInTheDocument();
      expect(screen.getByTestId('dropdown-item-1.5')).toBeInTheDocument();
      expect(screen.getByTestId('dropdown-item-1.25')).toBeInTheDocument();
      expect(screen.getByTestId('dropdown-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('dropdown-item-0.75')).toBeInTheDocument();
    });

    it('应该在选择倍速时调用setRate方法', () => {
      const mockSetRate = vi.fn();
      mockUseSpeechSynthesis.mockImplementation(() => ({
        isSupported: true,
        isPlaying: true,
        rate: 1,
        setRate: mockSetRate,
        start: vi.fn(),
        stop: vi.fn(),
        pause: vi.fn(),
        resume: vi.fn(),
      }));

      render(<VoiceButton {...defaultProps} />);

      // Click on 1.5x rate option
      const rateOption = screen.getByTestId('dropdown-item-1.5');
      fireEvent.click(rateOption);

      expect(mockSetRate).toHaveBeenCalledWith(1.5);
    });
  });

  describe('悬停效果测试', () => {
    it('应该在播放按钮悬停时显示动画图标', () => {
      render(<VoiceButton {...defaultProps} />);

      const playButton = screen.getByLabelText('语音播报');
      fireEvent.mouseEnter(playButton);

      expect(screen.getByTestId('voice-play-lottie')).toBeInTheDocument();
    });

    it('应该在播放按钮失去悬停时显示普通图标', () => {
      render(<VoiceButton {...defaultProps} />);

      const playButton = screen.getByLabelText('语音播报');
      fireEvent.mouseEnter(playButton);
      fireEvent.mouseLeave(playButton);

      expect(screen.getByTestId('play-icon')).toBeInTheDocument();
    });

    it('应该在播放时悬停显示暂停图标', () => {
      mockUseSpeechSynthesis.mockImplementation(() => ({
        isSupported: true,
        isPlaying: true,
        rate: 1,
        setRate: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        pause: vi.fn(),
        resume: vi.fn(),
      }));

      render(<VoiceButton {...defaultProps} />);

      const playingBox = screen.getByLabelText('停止播报');
      fireEvent.mouseEnter(playingBox);

      expect(screen.getByTestId('pause-icon')).toBeInTheDocument();
    });
  });

  describe('默认参数测试', () => {
    it('应该使用默认参数', () => {
      render(<VoiceButton {...defaultProps} />);

      // Verify the component renders without errors
      expect(screen.getByLabelText('语音播报')).toBeInTheDocument();
    });

    it('应该使用自定义的defaultRate', () => {
      render(<VoiceButton {...defaultProps} defaultRate={1.5} />);

      // Verify the component renders without errors
      expect(screen.getByLabelText('语音播报')).toBeInTheDocument();
    });

    it('应该使用自定义的rateOptions', () => {
      render(<VoiceButton {...defaultProps} rateOptions={[2, 1.5, 1]} />);

      // Verify the component renders without errors
      expect(screen.getByLabelText('语音播报')).toBeInTheDocument();
    });
  });
});

// Mock the useSpeechSynthesis hook in the module
vi.mock('../../src/Hooks/useSpeechSynthesis', () => ({
  useSpeechSynthesis: () => mockUseSpeechSynthesis(),
}));