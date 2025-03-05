import { BaseMarkdownEditor } from '@ant-design/md-editor';
import React, { useEffect, useRef } from 'react';
import 'reveal.js/dist/reveal.css';

import './white.css';

const splitMarkdown = (markdown: string) => {
  if (markdown.includes('\n##')) {
    return markdown.split('\n##').map((line, index) => {
      if (!line?.startsWith('#') && index !== 0) {
        return `##` + line;
      }
      return line;
    });
  }
  if (markdown.length > 100) {
    return markdown.split('\n\n');
  }
  return [markdown];
};

export function Slides(props: { initValue: string }) {
  const deckDivRef = useRef<HTMLDivElement>(null); // reference to deck container div
  const deckRef = useRef<any | null>(null); // reference to deck reveal instance

  useEffect(() => {
    const init = async () => {
      const Reveal = await import('reveal.js').then((module) => module.default);
      if (deckRef.current) return;
      deckRef.current = new Reveal(deckDivRef.current!, {
        transition: 'slide',
      });
      deckRef.current.initialize({}).then(() => {
        console.log('Reveal.js initialized.');
      });
      return () => {
        try {
          if (deckRef.current) {
            deckRef.current.destroy();
            deckRef.current = null;
          }
        } catch (e) {
          console.warn('Reveal.js destroy call failed.');
        }
      };
    };
    init();
  }, []);

  return (
    <div
      className="reveal"
      ref={deckDivRef}
      style={{
        height: '100vh',
      }}
    >
      <div className="slides">
        {
          splitMarkdown(props.initValue)?.map((line, index) => {
            return (
              <section key={index}>
                <BaseMarkdownEditor
                  readonly
                  toc={false}
                  reportMode
                  style={{
                    height: '100%',
                    padding: 0,
                    margin: 0,
                    width: '100%',
                  }}
                  editorStyle={{
                    maxHeight: '80vh',
                    overflow: 'auto',
                  }}
                  contentStyle={{
                    width: '100%',
                    padding: 0,
                    margin: 0,
                    height: '100%',
                    overflow: 'hidden',
                  }}
                  initValue={line}
                />
              </section>
            );
          }) as React.ReactNode[]
        }
      </div>
    </div>
  );
}
