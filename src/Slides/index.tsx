import { MarkdownEditor } from '@ant-design/md-editor';
import { useEffect, useRef } from 'react';
import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import './white.css';

export function Slides(props: { initValue: string }) {
  const deckDivRef = useRef<HTMLDivElement>(null); // reference to deck container div
  const deckRef = useRef<Reveal.Api | null>(null); // reference to deck reveal instance

  useEffect(() => {
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
        {props.initValue?.split('\n##').map((line, index) => {
          return (
            <section key={index}>
              <MarkdownEditor
                readonly
                toc={false}
                reportMode
                style={{ height: '100%', padding: 0, margin: 0, width: '100%' }}
                contentStyle={{
                  width: '100%',
                  padding: 0,
                  margin: 0,
                  height: '100%',
                  overflow: 'hidden',
                }}
                initValue={line?.startsWith('#') ? line : `##` + line}
              />
            </section>
          );
        })}
      </div>
    </div>
  );
}
