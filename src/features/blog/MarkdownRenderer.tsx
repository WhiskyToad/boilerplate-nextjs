"use client";

import { FiCheckCircle, FiCopy } from "react-icons/fi";
import { useState } from "react";

interface MarkdownRendererProps {
  content: string;
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6">
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={handleCopy}
          className="btn btn-sm btn-ghost bg-base-100/80 backdrop-blur-sm gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? (
            <>
              <FiCheckCircle className="w-4 h-4 text-success" />
              Copied!
            </>
          ) : (
            <>
              <FiCopy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>
      <div className="mockup-code bg-base-200 shadow-lg border border-base-300">
        <pre data-prefix=">" className="text-primary">
          <code className="text-base-content">{code}</code>
        </pre>
      </div>
      {language && (
        <div className="absolute top-3 left-3 badge badge-primary badge-sm">
          {language}
        </div>
      )}
    </div>
  );
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Parse markdown into structured HTML with better styling
  const renderContent = () => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let currentParagraph: string[] = [];
    let codeBlock: { lines: string[]; language: string } | null = null;
    let listItems: string[] = [];
    let key = 0;

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const text = currentParagraph.join(' ');
        elements.push(
          <p key={`p-${key++}`} className="text-lg leading-relaxed text-base-content/80 my-6">
            {parseInline(text)}
          </p>
        );
        currentParagraph = [];
      }
    };

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${key++}`} className="space-y-3 my-6 ml-6">
            {listItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-primary mt-1">✓</span>
                <span className="text-base-content/80 leading-relaxed">{parseInline(item)}</span>
              </li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    const parseInline = (text: string) => {
      const parts: (string | JSX.Element)[] = [];
      let remaining = text;
      let partKey = 0;

      // Bold
      remaining = remaining.replace(/\*\*(.+?)\*\*/g, (_, content) => {
        const placeholder = `__BOLD_${partKey}__`;
        parts.push(<strong key={`bold-${partKey++}`} className="font-bold text-base-content">{content}</strong>);
        return placeholder;
      });

      // Inline code
      remaining = remaining.replace(/`(.+?)`/g, (_, content) => {
        const placeholder = `__CODE_${partKey}__`;
        parts.push(
          <code key={`code-${partKey++}`} className="px-2 py-1 bg-base-200 rounded text-sm text-accent font-mono border border-base-300">
            {content}
          </code>
        );
        return placeholder;
      });

      // Links
      remaining = remaining.replace(/\[(.+?)\]\((.+?)\)/g, (_, text, url) => {
        const placeholder = `__LINK_${partKey}__`;
        parts.push(
          <a key={`link-${partKey++}`} href={url} className="text-primary hover:text-primary-focus underline font-medium transition-colors" target="_blank" rel="noopener noreferrer">
            {text}
          </a>
        );
        return placeholder;
      });

      // Replace placeholders with actual elements
      const segments = remaining.split(/(__(?:BOLD|CODE|LINK)_\d+__)/);
      return segments.map((segment, i) => {
        const match = segment.match(/__(BOLD|CODE|LINK)_(\d+)__/);
        if (match) {
          return parts[parseInt(match[2])];
        }
        return segment;
      });
    };

    lines.forEach((line) => {
      // Code blocks
      if (line.startsWith('```')) {
        if (codeBlock) {
          // End code block
          elements.push(
            <CodeBlock key={`code-${key++}`} code={codeBlock.lines.join('\n')} language={codeBlock.language} />
          );
          codeBlock = null;
        } else {
          // Start code block
          flushParagraph();
          flushList();
          const language = line.replace('```', '').trim();
          codeBlock = { lines: [], language };
        }
        return;
      }

      if (codeBlock) {
        codeBlock.lines.push(line);
        return;
      }

      // Headers
      if (line.startsWith('### ')) {
        flushParagraph();
        flushList();
        const text = line.replace('### ', '');
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        elements.push(
          <h3 key={`h3-${key++}`} id={id} className="text-2xl font-bold text-base-content mt-12 mb-6 flex items-center gap-3 scroll-mt-24">
            <span className="text-primary">▸</span>
            {text}
          </h3>
        );
        return;
      }

      if (line.startsWith('## ')) {
        flushParagraph();
        flushList();
        const text = line.replace('## ', '');
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        elements.push(
          <div key={`h2-wrap-${key++}`} id={id} className="scroll-mt-24">
            <h2 className="text-3xl font-bold text-base-content mt-16 mb-6">
              {text}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mb-8"></div>
          </div>
        );
        return;
      }

      if (line.startsWith('# ')) {
        flushParagraph();
        flushList();
        // Skip the main title as it's already rendered in the header
        return;
      }

      // Lists
      if (line.match(/^[-*]\s/)) {
        flushParagraph();
        listItems.push(line.replace(/^[-*]\s/, ''));
        return;
      }

      if (line.match(/^\d+\.\s/)) {
        flushParagraph();
        listItems.push(line.replace(/^\d+\.\s/, ''));
        return;
      }

      // Empty line
      if (line.trim() === '') {
        flushParagraph();
        flushList();
        return;
      }

      // Regular text
      flushList();
      currentParagraph.push(line);
    });

    flushParagraph();
    flushList();

    return elements;
  };

  return (
    <article className="prose prose-lg max-w-none">
      {renderContent()}
    </article>
  );
}
