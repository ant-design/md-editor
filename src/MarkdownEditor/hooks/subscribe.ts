import { IObjectDidChange, IValueDidChange, observe } from 'mobx';
import { useEffect, useLayoutEffect } from 'react';
import { Observable, Subject } from 'rxjs';

/**
 * 观察对象的特定键值变化，并在变化时调用回调函数。
 *
 * @template T - 对象的类型。
 * @template K - 对象键的类型。
 * @param {T} data - 要观察的对象。
 * @param {K} key - 要观察的对象键。
 * @param {(value: IValueDidChange<T[K]>) => void} fn - 当键值变化时调用的回调函数。
 */
export const useObserveKey = <T extends object, K extends keyof T>(
  data: T,
  key: K,
  fn: (value: IValueDidChange<T[K]>) => void,
) => {
  useEffect(() => {
    const cancel = observe(data, key, fn);
    return () => cancel();
  }, []);
};

/**
 * 观察对象的变化并在变化时调用回调函数。
 *
 * @template T - 要观察的对象类型。
 * @param {T} data - 要观察的对象。
 * @param {(value: IObjectDidChange<T> & { newValue: any; oldValue: any }) => void} fn - 当对象发生变化时调用的回调函数。
 *
 * @returns {void}
 */
export const useObserve = <T extends object>(
  data: T,
  fn: (value: IObjectDidChange<T> & { newValue: any; oldValue: any }) => void,
) => {
  useEffect(() => {
    // @ts-ignore
    const cancel = observe(data, fn);
    return () => cancel();
  }, []);
};

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
    const cancel = subject.subscribe(fn);
    return () => cancel.unsubscribe();
  }, deps);
};
