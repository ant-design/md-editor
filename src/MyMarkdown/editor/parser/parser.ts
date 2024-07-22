import { parserMarkdown } from './worker';
export type ParserResult = {
  schema: any[];
  links: { path: number[]; target: string }[];
};

const transformResult = (result: ParserResult) => {
  return {
    schema: result.schema?.filter((s) => {
      if (s.language === 'html' && s.otherProps) {
        return false;
      }
      return true;
    }),
    links: result.links || [],
  };
};

export const parserMdToSchema = (code: string): ParserResult => {
  return transformResult(parserMarkdown(code));
};
