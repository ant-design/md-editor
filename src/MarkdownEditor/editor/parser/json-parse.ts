/* eslint-disable no-var */
/* eslint-disable no-param-reassign */
import { parse } from 'partial-json';

/**
 * 部分 JSON 解析函数
 *
 * 基于 partial-json 库的封装，支持解析不完整或格式不严格的 JSON 字符串。
 * 这对于处理流式 JSON 数据或用户输入的 JSON 内容特别有用。
 *
 * 主要特性：
 * - 支持解析不完整的 JSON（如缺少结尾括号）
 * - 容错性强，能处理格式不规范的 JSON
 * - 适用于实时编辑场景中的 JSON 内容验证
 * - 支持渐进式 JSON 构建和解析
 *
 * @param input - 要解析的 JSON 字符串或数据
 * @returns 解析后的 JavaScript 对象，如果解析失败则返回相应的错误或部分结果
 *
 * @example
 * ```typescript
 * // 解析完整的 JSON
 * const result1 = partialParse('{"name": "John", "age": 30}');
 * console.log(result1); // { name: "John", age: 30 }
 *
 * // 解析不完整的 JSON
 * const result2 = partialParse('{"name": "John", "age":');
 * console.log(result2); // { name: "John" }
 *
 * // 解析数组
 * const result3 = partialParse('[1, 2, 3');
 * console.log(result3); // [1, 2, 3]
 * ```
 *
 * @remarks
 * - 该函数主要用于 Markdown 编辑器中 Schema 类型代码块的实时解析
 * - 支持编辑过程中的即时反馈和验证
 * - 基于第三方库 partial-json 实现
 */
export const partialParse = function partialParse(input: any) {
  return parse(input);
};

export default partialParse;
