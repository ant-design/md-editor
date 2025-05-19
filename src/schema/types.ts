export interface BaseProperty {
  title: string;
  required?: boolean;
  description?: string;
}

export interface StringProperty extends BaseProperty {
  type: 'string';
  default: string;
  enum?: string[];
  pattern?: string;
  patternMessage?: string;
  minLength?: number;
  maxLength?: number;
}

export interface NumberProperty extends BaseProperty {
  type: 'number';
  default: number;
  minimum?: number;
  maximum?: number;
  step?: number;
  unit?: string;
}

export type SchemaProperty = StringProperty | NumberProperty;

export interface ComponentProperties {
  [key: string]: SchemaProperty;
}

export interface ThemeConfig {
  colorPalette: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    text: {
      primary: string;
      secondary: string;
    };
  };
  spacing: {
    base: number;
    multiplier: number;
  };
  typography: {
    fontFamily: string;
    fontSizes: number[];
    lineHeights: {
      normal: number;
      heading: number;
    };
  };
  breakpoints: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

export interface PageConfig {
  layout: 'flex';
  router: {
    mode: 'hash';
    basePath: string;
  };
  globalVariables: {
    colors: {
      sunny: string;
      rainy: string;
      cloudy: string;
    };
    constants: {
      refreshInterval: number;
    };
  };
}

export interface DataSourceConfig {
  restAPI: {
    baseURL: string;
    defaultHeaders: Record<string, string>;
    timeout: number;
    interceptors: {
      request: boolean;
      response: boolean;
    };
  };
  mock: {
    enable: boolean;
    responseDelay: number;
    dataPath: string;
  };
}

export interface PreviewSettings {
  viewport: {
    defaultDevice: string;
    responsive: boolean;
    customSizes: Array<{
      name: string;
      width: number;
      height: number;
    }>;
  };
  environment: {
    mockData: boolean;
    networkThrottle: string;
    debugMode: boolean;
  };
}

export interface ComponentConfig {
  properties: ComponentProperties;
  type: 'html';
  schema: string;
}

export interface LowCodeSchema {
  version: string;
  name: string;
  description: string;
  author: string;
  createTime: string;
  updateTime: string;
  pageConfig: PageConfig;
  dataSources: DataSourceConfig;
  component: ComponentConfig;
  theme: ThemeConfig;
  previewSettings: PreviewSettings;
}
