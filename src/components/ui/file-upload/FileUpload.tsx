'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload, FiFile, FiImage, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi'
import { Button } from '@/components/ui/button/Button'

export interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>
  accept?: Record<string, string[]>
  multiple?: boolean
  maxSize?: number
  maxFiles?: number
  disabled?: boolean
  className?: string
  variant?: 'default' | 'avatar' | 'document'
  children?: React.ReactNode
}

export interface FileItem {
  file: File
  id: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress?: number
  error?: string
  url?: string
}

export function FileUpload({
  onUpload,
  accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 1,
  disabled = false,
  className = '',
  variant = 'default',
  children
}: FileUploadProps) {
  const [files, setFiles] = useState<FileItem[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled || isUploading) return

    // Create file items
    const newFiles: FileItem[] = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(7),
      status: 'pending'
    }))

    setFiles(prev => {
      const combined = multiple ? [...prev, ...newFiles] : newFiles
      return combined.slice(0, maxFiles)
    })

    // Start upload
    setIsUploading(true)
    try {
      await onUpload(acceptedFiles)
      
      setFiles(prev => prev.map(item => 
        newFiles.find(newFile => newFile.id === item.id)
          ? { ...item, status: 'success' as const }
          : item
      ))
    } catch (error) {
      setFiles(prev => prev.map(item => 
        newFiles.find(newFile => newFile.id === item.id)
          ? { 
              ...item, 
              status: 'error' as const, 
              error: error instanceof Error ? error.message : 'Upload failed' 
            }
          : item
      ))
    } finally {
      setIsUploading(false)
    }
  }, [onUpload, disabled, isUploading, multiple, maxFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxSize,
    maxFiles,
    disabled: disabled || isUploading
  })

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(item => item.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <FiImage className="w-4 h-4" />
    }
    return <FiFile className="w-4 h-4" />
  }

  const getStatusIcon = (status: FileItem['status']) => {
    switch (status) {
      case 'uploading':
        return <div className="loading loading-spinner loading-xs" />
      case 'success':
        return <FiCheck className="w-4 h-4 text-success" />
      case 'error':
        return <FiAlertCircle className="w-4 h-4 text-error" />
      default:
        return null
    }
  }

  if (variant === 'avatar') {
    return (
      <div className={`relative ${className}`}>
        <div
          {...getRootProps()}
          className={`
            relative w-24 h-24 rounded-full border-2 border-dashed cursor-pointer
            transition-all duration-200 overflow-hidden
            ${isDragActive 
              ? 'border-primary bg-primary/10' 
              : 'border-base-300 hover:border-primary/50'
            }
            ${disabled ? 'cursor-not-allowed opacity-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          {files.length > 0 && files[0].file.type.startsWith('image/') ? (
            <img 
              src={URL.createObjectURL(files[0].file)} 
              alt="Avatar preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <FiUpload className="w-6 h-6 text-base-content/50" />
            </div>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="loading loading-spinner loading-sm text-white" />
            </div>
          )}
        </div>
        <p className="text-xs text-center mt-2 text-base-content/60">
          Click or drag to upload
        </p>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-all duration-200
          ${isDragActive 
            ? 'border-primary bg-primary/10' 
            : 'border-base-300 hover:border-primary/50 hover:bg-base-50'
          }
          ${disabled ? 'cursor-not-allowed opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {children || (
          <div className="space-y-2">
            <FiUpload className="w-8 h-8 mx-auto text-base-content/50" />
            <div>
              <p className="text-sm font-medium">
                {isDragActive ? 'Drop files here' : 'Choose files or drag and drop'}
              </p>
              <p className="text-xs text-base-content/60">
                Max {formatFileSize(maxSize)} per file
                {multiple && `, up to ${maxFiles} files`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-base-100 border border-base-300 rounded-lg">
              {getIcon(item.file)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.file.name}</p>
                <p className="text-xs text-base-content/60">
                  {formatFileSize(item.file.size)}
                </p>
                {item.error && (
                  <p className="text-xs text-error">{item.error}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(item.status)}
                <button
                  onClick={() => removeFile(item.id)}
                  className="btn btn-ghost btn-xs btn-circle"
                  disabled={isUploading}
                >
                  <FiX className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}