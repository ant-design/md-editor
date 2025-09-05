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
