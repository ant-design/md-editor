import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { VoiceIcon } from '../../icons/VoiceIcon';
import VoicingLottie from '../../icons/VoicingLottie';
import { useStyle } from './style';

export type VoiceRecognizer = {
  start: () => Promise<void>;
  stop: () => Promise<void>;
};

export type CreateRecognizer = (handlers: {
  onPartial: (text: string) => void;
  onError?: (error: unknown) => void;
}) => Promise<VoiceRecognizer>;

type VoiceInputButtonProps = {
  recording: boolean;
  disabled?: boolean;
  onStart: () => Promise<void>;
  onStop: () => Promise<void>;
  style?: React.CSSProperties;
};

/**
 * 语音输入按钮。
 * - recording=false：未开始
 * - recording=true：录音中
 * 外部通过 `createRecognizer` 提供语音识别实现。
 */
export const VoiceInputButton: React.FC<VoiceInputButtonProps> = (props) => {
  const { recording, disabled, onStart, onStop, style } = props;
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const baseCls = getPrefixCls('md-input-field-voice-button');
  const { wrapSSR, hashId } = useStyle(baseCls);

  return wrapSSR(
    <div
      data-testid="voice-input-button"
      role="button"
      aria-pressed={recording}
      className={classNames(baseCls, hashId, {
        [`${baseCls}-disabled`]: disabled,
        [`${baseCls}-recording`]: recording,
      })}
      style={style}
      onClick={async () => {
        if (disabled) return;
        if (recording) {
          await onStop();
        } else {
          await onStart();
        }
      }}
    >
      <ErrorBoundary fallback={<div />}>
        {recording ? (
          <VoicingLottie size={16} />
        ) : (
          <VoiceIcon width={16} height={16} />
        )}
      </ErrorBoundary>
    </div>,
  );
};

export default VoiceInputButton;
