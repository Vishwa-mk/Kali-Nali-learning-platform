'use client';

import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Play, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { editor } from 'monaco-editor';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  placeholder?: string;
}

export function CodeEditor({ 
  value, 
  onChange, 
  language = 'javascript',
  height = '400px',
  placeholder = '// Write your code here...'
}: CodeEditorProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    success: boolean;
    output: string;
    error?: string;
  } | null>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  const executeCode = () => {
    if (!value.trim()) {
      setExecutionResult({
        success: false,
        output: '',
        error: 'No code to execute. Please write some code first.',
      });
      return;
    }

    setIsExecuting(true);
    setExecutionResult(null);

    // Save original console methods
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    try {
      // Capture console output
      const logs: string[] = [];

      console.log = (...args: any[]) => {
        logs.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
        originalLog.apply(console, args);
      };

      console.error = (...args: any[]) => {
        logs.push('ERROR: ' + args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
        originalError.apply(console, args);
      };

      console.warn = (...args: any[]) => {
        logs.push('WARN: ' + args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
        originalWarn.apply(console, args);
      };

      // Execute JavaScript code in a controlled environment
      if (language === 'javascript' || language === 'typescript') {
        // Create a safe execution context
        const result = new Function(`
          ${value}
          return typeof main !== 'undefined' ? main() : undefined;
        `)();

        const output = logs.length > 0 
          ? logs.join('\n') 
          : (result !== undefined ? String(result) : 'Code executed successfully (no output)');

        setExecutionResult({
          success: true,
          output,
        });
      } else {
        // For other languages, show a message
        setExecutionResult({
          success: false,
          output: '',
          error: `Code execution for ${language} is not yet supported. Only JavaScript/TypeScript can be executed.`,
        });
      }
    } catch (error: any) {
      setExecutionResult({
        success: false,
        output: '',
        error: error.message || 'An error occurred while executing the code.',
      });
    } finally {
      // Restore console methods
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden bg-[#1e1e1e]">
        <Editor
          height={height}
          language={language}
          value={value || placeholder}
          onChange={(val) => onChange(val || '')}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          onClick={executeCode} 
          disabled={isExecuting}
          variant="default"
        >
          {isExecuting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Run Code
            </>
          )}
        </Button>
        {executionResult && (
          <div className="flex items-center gap-2 text-sm">
            {executionResult.success ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span className={executionResult.success ? 'text-green-500' : 'text-red-500'}>
              {executionResult.success ? 'Execution successful' : 'Execution failed'}
            </span>
          </div>
        )}
      </div>

      {executionResult && (
        <Alert variant={executionResult.success ? 'default' : 'destructive'}>
          <AlertDescription>
            <div className="space-y-2">
              {executionResult.error && (
                <div className="font-semibold text-red-500">Error:</div>
              )}
              <pre className="text-sm bg-muted p-3 rounded overflow-auto max-h-48 font-mono">
                {executionResult.error || executionResult.output}
              </pre>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

