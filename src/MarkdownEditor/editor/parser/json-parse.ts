/* eslint-disable no-var */
/* eslint-disable no-param-reassign */
import { parse } from 'partial-json';

const partialParse = function partialParse(input: any) {
  return parse(input);
};

export default partialParse;
