import { DownOutlined } from '@ant-design/icons';
import { ConfigProvider, Dropdown, Flex, Tooltip } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { PauseIcon } from '../../../icons/PauseIcon';
import VoicePlayLottie from '../../../icons/VoicePlayLottie';
import VoicingLottie from '../../../icons/VoicingLottie';
import { useStyle } from './style';
import { PlayIcon } from '../../../icons/PlayIcon';
import useSpeechSynthesis from '../../../hooks/useSpeechSynthesis';

/**
 * 语音播报参数
 * - 由内置 `useSpeechSynthesis` 或外部传入的 `useSpeech` 适配器消费
 */
export type UseSpeechSynthesisOptions = {
  /** 朗读文本内容 */
  text: string;
  /** 初始倍速，默认 1（范围建议 0.5~2） */
  defaultRate?: number;
};

/**
 * 语音播报结果（适配器统一返回结构）
 */
export type UseSpeechSynthesisResult = {
  /**
   * 是否支持当前环境的语音播报
   * - 外部提供 `useSpeech` 适配器时，可不返回或忽略该字段
   * - 仅默认实现（Web Speech）用于环境探测
   */
  isSupported?: boolean;
  /** 是否正在播放 */
  isPlaying: boolean;
  /** 当前倍速 */
  rate: number;
  /** 设置倍速（如正在播报，调用方可在内部重启以生效） */
  setRate: (value: number) => void;
  /** 开始播报（应为幂等：重复调用不产生副作用） */
  start: () => void;
  /** 停止/取消播报（应清理内部资源与回调） */
  stop: () => void;
  /** 暂停播报（如不支持可为 no-op） */
  pause: () => void;
  /** 恢复播报（如不支持可为 no-op） */
  resume: () => void;
};

/**
 * 通用语音适配器接口
 * - 用于接入除 Web Speech 外的任意 TTS 能力
 * - 返回结构需满足 `UseSpeechSynthesisResult`
 * - 当提供该适配器时，`VoiceButton` 将视语音能力为“可用”，不再受浏览器支持度限制
 */
export type UseSpeechAdapter = (
  options: UseSpeechSynthesisOptions,
) => UseSpeechSynthesisResult;

export type VoiceButtonProps = {
  /** 朗读文本 */
  text: string;
  /** 初始倍速，默认 1 */
  defaultRate?: number;
  /** 可选倍速，默认 [1.5, 1.25, 1, 0.75] */
  rateOptions?: number[];
  /**
   * 外部语音适配器（可替换默认 Web Speech 实现）
   * - 提供后组件一律视为“支持语音播报”，按钮将可用
   * - 适配器需实现 start/stop/pause/resume 与倍速控制（必要时内部重启）
   */
  useSpeech?: UseSpeechAdapter;
};

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  text,
  defaultRate = 1,
  rateOptions = [1.5, 1.25, 1, 0.75],
  useSpeech,
}) => {
  const configContext = React.useContext(ConfigProvider.ConfigContext);
  const baseCls = configContext?.getPrefixCls(`agent-voice-button`) || 'agent-voice-button';
  const { wrapSSR, hashId } = useStyle(baseCls);
  const [isPlayHover, setIsPlayHover] = useState<boolean>(false);
  const [isPlayingHovered, setIsPlayingHovered] = useState(false);

  // 首渲染冻结适配器，防止运行时切换导致 Hooks 调用顺序风险
  const adapterRef = useRef<UseSpeechAdapter>( typeof useSpeech === 'function' ? useSpeech : useSpeechSynthesis);
  const { isSupported, isPlaying, rate, setRate, start, stop, pause, resume } = adapterRef.current({
    text,
    defaultRate,
  });

  // 如果外部提供了自定义适配器，则视为一定可用，避免受浏览器 Web Speech 支持度影响
  const isFeatureSupported = useMemo(
    () => (adapterRef.current !== useSpeechSynthesis) || isSupported,
    [isSupported],
  );

  const handleClick = () => {
    if (!isPlaying) {
      start();
      return;
    }
    stop();
  };

  const handleStop = () => {
    setIsPlayingHovered(false);
    setIsPlayHover(false);
    stop();
  };


  const handlePlayingMouseEnter = () => {
    setIsPlayingHovered(true);
    if (isPlaying) {
      pause();
    }
  };

  const handlePlayingMouseLeave = () => {
    setIsPlayingHovered(false);
    if (isPlaying) {
      resume();
    }
  };

  const tooltipText = useMemo(() => {
    if (!isFeatureSupported) return '当前环境不支持语音播报';
    return isPlaying ? '停止播报' : '语音播报';
  }, [isFeatureSupported, isPlaying]);

  const normalizedRateOptions = useMemo(() => {
    const set = new Set<number>([...rateOptions, 1]);
    return Array.from(set).sort((a, b) => b - a);
  }, [rateOptions]);

  const menuItems = useMemo(
    () =>
      normalizedRateOptions.map((r) => ({
        key: String(r),
        label: (
          <div className={`${baseCls}-rateItem ${hashId}`}>
            <span>{`${r}x`}</span>
            {r === rate ? <span>✓</span> : null}
          </div>
        ),
      })),
    [normalizedRateOptions, rate],
  );

  const rateDisplay = useMemo(() => `${rate}x`, [rate]);

  return wrapSSR(
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {!isPlaying ? (
        <div
          onMouseEnter={() => setIsPlayHover(true)}
          onMouseLeave={() => setIsPlayHover(false)}
          onClick={handleClick}
          className={`${baseCls}-playBox ${hashId}`}
          role="button"
          tabIndex={0}
          aria-label={'语音播报'}
          aria-disabled={!isFeatureSupported || !text}
        >
          <Tooltip title={tooltipText} mouseEnterDelay={0.1}>
            <Flex align="center" justify="center">{isPlayHover ? <VoicePlayLottie size={16} autoplay={true} loop={false} /> : <PlayIcon color="rgb(102, 111, 141)" width={14} />}</Flex>
          </Tooltip>
        </div>
      ) : (
        <div className={`${baseCls}-playingWrap ${hashId}`}>
          <div
            className={`${baseCls}-playingBox ${hashId}`}
            onMouseEnter={handlePlayingMouseEnter}
            onMouseLeave={handlePlayingMouseLeave}
            onClick={handleStop}
            role="button"
            tabIndex={0}
            aria-label={'停止播报'}
          >
            <Tooltip title={tooltipText} mouseEnterDelay={0.1}>
            <Flex align="center" justify="center">{isPlayingHovered ? <PauseIcon color="#767E8B" width={14} /> : <VoicingLottie size={16} />}</Flex>
            </Tooltip>
          </div>
          <Dropdown
            trigger={['click']}
            menu={{
              items: menuItems,
              onClick: (info) => {
                const v = Number(info.key);
                if (!Number.isNaN(v)) setRate(v);
              },
            }}
          >
            <div className={`${baseCls}-rateBox ${hashId}`}>
              <span style={{ fontSize: 12 }}>{rate === 1 ? '倍速' : rateDisplay}</span>
              <DownOutlined style={{ fontSize: 12 }} />
            </div>
          </Dropdown>
        </div>
      )}
    </div>,
  );
};

export default VoiceButton;
