import { useLayoutEffect } from 'react';
import { Observable, Subject } from 'rxjs';

/**
 * 订阅一个 `Subject` 或 `Observable`，并在值变化时调用指定的回调函数。
 *
 * @template T - `Subject` 或 `Observable` 中值的类型。
 * @param {Subject<T> | Observable<T>} subject - 要订阅的 `Subject` 或 `Observable`。
 * @param {(value: T) => void} fn - 当 `subject` 发出新值时调用的回调函数。
 * @param {any[]} [deps=[]] - 依赖项数组，当依赖项变化时重新订阅 `subject`。
 */
export const useSubject = <T>(
  subject: Subject<T> | Observable<T>,
  fn: (value: T) => void,
  deps: any[] = [],
) => {
  useLayoutEffect(() => {
    if (!subject) return;
    const cancel = subject?.subscribe?.(fn);
    return () => cancel?.unsubscribe?.();
  }, deps);
};
