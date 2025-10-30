'use client'

import { useState } from 'react'
import { FiCopy, FiCheck } from 'react-icons/fi'
import { Button } from '@/components/ui/button/Button'

export interface CodeBlockProps {
  code: string
  className?: string
}

export function CodeBlock({ code, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  return (
    <div className={`relative ${className || ''}`}>
      <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 overflow-x-auto shadow-lg">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-slate-400 text-xs font-mono ml-2">installation-code</span>
        </div>
        <pre className="text-sm font-mono text-slate-100 whitespace-pre-wrap leading-relaxed">
          {code}
        </pre>
      </div>
      <Button
        onClick={handleCopy}
        className="absolute top-3 right-3 bg-white/90 hover:bg-white border-gray-300 text-gray-700 hover:text-gray-900 shadow-sm backdrop-blur-sm"
        variant="ghost"
        size="sm"
      >
        {copied ? (
          <>
            <FiCheck className="w-4 h-4" />
            Copied
          </>
        ) : (
          <>
            <FiCopy className="w-4 h-4" />
            Copy
          </>
        )}
      </Button>
    </div>
  )
}