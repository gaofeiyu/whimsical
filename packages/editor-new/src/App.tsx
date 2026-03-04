import React, { useState, useEffect } from 'react';
import { JSONNode, createInitialState } from './core/types';
import { JsonRenderer } from './core/JsonRenderer';
import { CodeGenerator } from './compiler/CodeGenerator';
import { CodeParser } from './compiler/CodeParser';

const codeGen = new CodeGenerator();

const App: React.FC = () => {
  const [dsl, setDsl] = useState<JSONNode>(createInitialState());
  const [code, setCode] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');

  // Sync Code when DSL changes
  useEffect(() => {
    setCode(codeGen.generateCode(dsl));
  }, [dsl]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);

    // Attempt to parse Code back to DSL
    const parser = new CodeParser(dsl);
    const newDsl = parser.parseCode(newCode);
    if (newDsl) {
      setDsl(newDsl);
    }
  };

  const handleAiSimulate = () => {
    // In a real app, this would call an LLM with the prompt and current DSL
    if (!prompt.trim()) return;

    // Simulated AI response mutating the DSL
    const simulatedDsl = { ...dsl };

    // Simulate adding a button
    if (!simulatedDsl.children) simulatedDsl.children = [];
    simulatedDsl.children.push({
      id: crypto.randomUUID(),
      type: 'Button',
      props: {
        text: prompt,
        backgroundColor: '#007bff',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }
    });

    setDsl(simulatedDsl);
    setPrompt('');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', fontFamily: 'sans-serif' }}>
      {/* Left Pane: AI Chat */}
      <div style={{ width: '300px', borderRight: '1px solid #ccc', display: 'flex', flexDirection: 'column', backgroundColor: '#f9f9f9' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
          <h3>🤖 AI Assistant</h3>
          <p style={{ fontSize: '12px', color: '#666' }}>Describe what you want to build.</p>
        </div>
        <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
          {/* Chat history would go here */}
        </div>
        <div style={{ padding: '16px', borderTop: '1px solid #ccc' }}>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="E.g. Add a submit button"
            style={{ width: '100%', padding: '8px', minHeight: '60px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
          />
          <button
            onClick={handleAiSimulate}
            style={{ marginTop: '8px', width: '100%', padding: '8px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Generate
          </button>
        </div>
      </div>

      {/* Center Pane: Visual Preview */}
      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#e0e0e0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '8px 16px', backgroundColor: '#fff', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>画布 Preview</h3>
        </div>
        <div style={{ flex: 1, padding: '20px' }}>
          <JsonRenderer node={dsl} />
        </div>
      </div>

      {/* Right Pane: Code Editor */}
      <div style={{ width: '500px', borderLeft: '1px solid #ccc', display: 'flex', flexDirection: 'column' }}>
         <div style={{ padding: '8px 16px', backgroundColor: '#fff', borderBottom: '1px solid #ccc' }}>
          <h3 style={{ margin: 0 }}>React Code (Bidirectional)</h3>
        </div>
        <textarea
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          spellCheck={false}
          style={{ flex: 1, padding: '16px', border: 'none', backgroundColor: '#1e1e1e', color: '#d4d4d4', fontFamily: 'monospace', fontSize: '13px', resize: 'none' }}
        />
      </div>
    </div>
  );
};

export default App;
