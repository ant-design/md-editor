/* eslint-disable no-var */
/* eslint-disable no-param-reassign */
import json5 from 'json5';
const tokenize = function tokenize(input: string): {
  type: string;
  value: string;
}[] {
  let current = 0;
  let tokens = [];

  while (current < input.length) {
    let char = input[current];

    if (char === '\\') {
      current++;
      continue;
    }

    if (char === '{') {
      tokens.push({
        type: 'brace',
        value: '{',
      });

      current++;
      continue;
    }

    if (char === '}') {
      tokens.push({
        type: 'brace',
        value: '}',
      });

      current++;
      continue;
    }

    if (char === '[') {
      tokens.push({
        type: 'paren',
        value: '[',
      });

      current++;
      continue;
    }

    if (char === ']') {
      tokens.push({
        type: 'paren',
        value: ']',
      });

      current++;
      continue;
    }

    if (char === ':') {
      tokens.push({
        type: 'separator',
        value: ':',
      });

      current++;
      continue;
    }

    if (char === ',') {
      tokens.push({
        type: 'delimiter',
        value: ',',
      });

      current++;
      continue;
    }

    if (char === '"') {
      let value = '';
      let danglingQuote = false;

      char = input[++current];

      while (char !== '"') {
        if (current === input.length) {
          danglingQuote = true;
          break;
        }

        if (char === '\\') {
          current++;
          if (current === input.length) {
            danglingQuote = true;
            break;
          }
          value += char + input[current];
          char = input[++current];
        } else {
          value += char;
          char = input[++current];
        }
      }

      char = input[++current];

      if (!danglingQuote) {
        tokens.push({
          type: 'string',
          value: value,
        });
      }
      continue;
    }

    let WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }

    let NUMBERS = /[0-9]/;
    if (NUMBERS.test(char) || char === '-' || char === '.') {
      let _value = '';

      if (char === '-') {
        _value += char;
        char = input[++current];
      }

      while (NUMBERS.test(char) || char === '.') {
        _value += char;
        char = input[++current];
      }

      tokens.push({
        type: 'number',
        value: _value,
      });
      continue;
    }

    let LETTERS = /[a-z]/i;
    if (LETTERS.test(char)) {
      let _value2 = '';

      while (LETTERS.test(char)) {
        if (current === input.length) {
          break;
        }
        _value2 += char;
        char = input[++current];
      }

      if (_value2 === 'true' || _value2 === 'false') {
        tokens.push({
          type: 'name',
          value: _value2,
        });
      } else {
        throw new Error('Invalid token: ' + _value2 + ' is not a valid token!');
      }
      continue;
    }

    current++;
  }

  return tokens;
};

const strip = function strip(tokens: any[]): any[] {
  if (tokens.length === 0) {
    return tokens;
  }

  let lastToken = tokens[tokens.length - 1];

  switch (lastToken.type) {
    case 'separator':
      tokens = tokens.slice(0, tokens.length - 1);
      return strip(tokens);
      break;
    case 'number':
      var lastCharacterOfLastToken =
        lastToken.value[lastToken.value.length - 1];
      if (
        lastCharacterOfLastToken === '.' ||
        lastCharacterOfLastToken === '-'
      ) {
        tokens = tokens.slice(0, tokens.length - 1);
        return strip(tokens);
      }
    case 'string':
      var tokenBeforeTheLastToken = tokens[tokens.length - 2];
      if (tokenBeforeTheLastToken.type === 'delimiter') {
        tokens = tokens.slice(0, tokens.length - 1);
        return strip(tokens);
      } else if (
        tokenBeforeTheLastToken.type === 'brace' &&
        tokenBeforeTheLastToken.value === '{'
      ) {
        tokens = tokens.slice(0, tokens.length - 1);
        return strip(tokens);
      }
      break;
    case 'delimiter':
      tokens = tokens.slice(0, tokens.length - 1);
      return strip(tokens);
      break;
  }

  return tokens;
};

const unStrip = function unStrip(tokens: any[]) {
  let tail: string[] = [];

  tokens.forEach((token: { type: string; value: string }) => {
    if (token.type === 'brace') {
      if (token.value === '{') {
        tail.push('}');
      } else {
        tail.splice(tail.lastIndexOf('}'), 1);
      }
    }
    if (token.type === 'paren') {
      if (token.value === '[') {
        tail.push(']');
      } else {
        tail.splice(tail.lastIndexOf(']'), 1);
      }
    }
  });

  if (tail.length > 0) {
    tail.reverse().forEach((item) => {
      if (item === '}') {
        tokens.push({
          type: 'brace',
          value: '}',
        });
      } else if (item === ']') {
        tokens.push({
          type: 'paren',
          value: ']',
        });
      }
    });
  }

  return tokens;
};

const generate = function generate(tokens: any[]) {
  let output = '';

  tokens.forEach((token: { type: any; value: string }) => {
    switch (token.type) {
      case 'string':
        output += '"' + token.value + '"';
        break;
      default:
        output += token.value;
        break;
    }
  });

  return output;
};
const partialParse = function partialParse(input: any) {
  return json5.parse(generate(unStrip(strip(tokenize(input)))));
};

export default partialParse;
