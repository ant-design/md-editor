import { beforeEach, describe, expect, it } from 'vitest';
import lowcodeSchema from '../../src/schema/schema.definition.json';
import {
  SchemaValidator,
  mdDataSchemaValidator,
} from '../../src/schema/validator';

// Mock Ajv
vi.mock('ajv', () => {
  const mockValidate = vi.fn();
  const mockCompile = vi.fn(() => mockValidate);

  return {
    default: vi.fn().mockImplementation(() => ({
      compile: mockCompile,
    })),
  };
});

// Mock ajv-formats
vi.mock('ajv-formats', () => ({
  default: vi.fn(),
}));

describe('SchemaValidator', () => {
  let validator: SchemaValidator;
  let mockValidate: any;
  let mockCompile: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // 获取mock函数
    const Ajv = require('ajv').default;
    const ajvInstance = Ajv.mock.results[0].value;
    mockCompile = ajvInstance.compile;
    mockValidate = mockCompile();

    validator = new SchemaValidator();
  });

  describe('构造函数', () => {
    it('应该正确初始化Ajv实例', () => {
      const Ajv = require('ajv').default;
      expect(Ajv).toHaveBeenCalledWith({
        allErrors: true,
        verbose: true,
        strict: false,
      });
    });

    it('应该调用addFormats', () => {
      const addFormats = require('ajv-formats').default;
      expect(addFormats).toHaveBeenCalled();
    });

    it('应该编译schema', () => {
      expect(mockCompile).toHaveBeenCalledWith(lowcodeSchema);
    });
  });

  describe('validate方法', () => {
    it('应该返回验证成功的结果', () => {
      mockValidate.mockReturnValue(true);
      mockValidate.errors = undefined;

      const result = validator.validate({ test: 'data' });

      expect(result).toEqual({
        valid: true,
        errors: [],
      });
    });

    it('应该返回验证失败的结果和错误信息', () => {
      const mockErrors = [
        {
          instancePath: '/test',
          message: '应该是一个字符串',
        },
        {
          instancePath: '/count',
          message: '应该是一个数字',
        },
      ];

      mockValidate.mockReturnValue(false);
      mockValidate.errors = mockErrors;

      const result = validator.validate({ test: 123, count: 'invalid' });

      expect(result).toEqual({
        valid: false,
        errors: [
          {
            path: '/test',
            message: '应该是一个字符串',
          },
          {
            path: '/count',
            message: '应该是一个数字',
          },
        ],
      });
    });

    it('应该处理没有错误信息的错误', () => {
      const mockErrors = [
        {
          instancePath: '/test',
          message: undefined,
        },
      ];

      mockValidate.mockReturnValue(false);
      mockValidate.errors = mockErrors;

      const result = validator.validate({ test: 'invalid' });

      expect(result).toEqual({
        valid: false,
        errors: [
          {
            path: '/test',
            message: '未知错误',
          },
        ],
      });
    });

    it('应该处理空错误数组', () => {
      mockValidate.mockReturnValue(false);
      mockValidate.errors = [];

      const result = validator.validate({ test: 'data' });

      expect(result).toEqual({
        valid: false,
        errors: [],
      });
    });

    it('应该处理null错误', () => {
      mockValidate.mockReturnValue(false);
      mockValidate.errors = null;

      const result = validator.validate({ test: 'data' });

      expect(result).toEqual({
        valid: false,
        errors: [],
      });
    });

    it('应该处理undefined错误', () => {
      mockValidate.mockReturnValue(false);
      mockValidate.errors = undefined;

      const result = validator.validate({ test: 'data' });

      expect(result).toEqual({
        valid: false,
        errors: [],
      });
    });
  });

  describe('边界情况', () => {
    it('应该处理null数据', () => {
      mockValidate.mockReturnValue(false);
      mockValidate.errors = [
        {
          instancePath: '',
          message: '数据不能为空',
        },
      ];

      const result = validator.validate(null);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('应该处理undefined数据', () => {
      mockValidate.mockReturnValue(false);
      mockValidate.errors = [
        {
          instancePath: '',
          message: '数据不能为空',
        },
      ];

      const result = validator.validate(undefined);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('应该处理空对象', () => {
      mockValidate.mockReturnValue(true);
      mockValidate.errors = undefined;

      const result = validator.validate({});

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('应该处理复杂嵌套对象', () => {
      const complexData = {
        components: [
          {
            type: 'text',
            props: {
              content: 'Hello World',
            },
          },
        ],
        layout: {
          type: 'flex',
          direction: 'column',
        },
      };

      mockValidate.mockReturnValue(true);
      mockValidate.errors = undefined;

      const result = validator.validate(complexData);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('错误处理', () => {
    it('应该处理验证函数抛出异常的情况', () => {
      mockValidate.mockImplementation(() => {
        throw new Error('验证过程中发生错误');
      });

      expect(() => validator.validate({ test: 'data' })).toThrow(
        '验证过程中发生错误',
      );
    });

    it('应该处理编译函数抛出异常的情况', () => {
      mockCompile.mockImplementation(() => {
        throw new Error('编译schema时发生错误');
      });

      expect(() => validator.validate({ test: 'data' })).toThrow(
        '编译schema时发生错误',
      );
    });
  });
});

describe('mdDataSchemaValidator单例', () => {
  it('应该导出SchemaValidator的实例', () => {
    expect(mdDataSchemaValidator).toBeInstanceOf(SchemaValidator);
  });

  it('应该能够验证数据', () => {
    // 这里我们测试单例实例是否正常工作
    // 由于我们已经mock了Ajv，这里主要测试实例化是否成功
    expect(typeof mdDataSchemaValidator.validate).toBe('function');
  });
});

describe('集成测试', () => {
  it('应该能够处理真实的schema验证场景', () => {
    // 这个测试模拟真实的验证场景
    const validData = {
      type: 'component',
      props: {
        text: '测试文本',
      },
    };

    const invalidData = {
      type: 'invalid_type',
      props: {
        invalidProp: 123,
      },
    };

    // 模拟验证结果
    const mockValidate = vi.fn();
    const mockCompile = vi.fn(() => mockValidate);

    // 重新mock以测试不同场景
    const Ajv = require('ajv').default;
    const ajvInstance = Ajv.mock.results[0].value;
    ajvInstance.compile = mockCompile;

    // 测试有效数据
    mockValidate.mockReturnValue(true);
    mockValidate.errors = undefined;

    const validator = new SchemaValidator();
    const validResult = validator.validate(validData);

    expect(validResult.valid).toBe(true);
    expect(validResult.errors).toHaveLength(0);

    // 测试无效数据
    mockValidate.mockReturnValue(false);
    mockValidate.errors = [
      {
        instancePath: '/type',
        message: '无效的组件类型',
      },
    ];

    const invalidResult = validator.validate(invalidData);

    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.errors).toHaveLength(1);
    expect(invalidResult.errors[0].path).toBe('/type');
    expect(invalidResult.errors[0].message).toBe('无效的组件类型');
  });
});
