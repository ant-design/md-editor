import { CodeNode, Elements } from '../../el';
import { parserMarkdownToSlateNode } from './parserMarkdownToSlateNode';

export type ParserResult = {
  schema: Elements[];
  links: { path: number[]; target: string }[];
};

const transformResult = (result: ParserResult) => {
  return {
    schema: result.schema?.filter((s) => {
      if ((s as CodeNode).language === 'html' && (s as CodeNode).otherProps) {
        return false;
      }
      if (!s.type && !(s as any)?.text) {
        return false;
      }
      return true;
    }),
    links: result.links || [],
  };
};

export const parserMdToSchema = (code: string): ParserResult => {
  return transformResult(parserMarkdownToSlateNode(code));
};
