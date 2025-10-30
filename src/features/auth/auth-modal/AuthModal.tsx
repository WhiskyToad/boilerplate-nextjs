'use client'

import { useState } from 'react'
import { LoginForm } from '../login-form/LoginForm'
import { SignupForm } from '../signup-form/SignupForm'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'login' | 'signup'
}

export function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode)

  const handleSuccess = () => {
    onClose()
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login')
  }

  if (!isOpen) return null

  return (
    <div className="modal modal-open">
      <div className="modal-box p-0 max-w-md">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10 p-3"
        >
          ✕
        </button>
        
        <div className="p-6">
          {mode === 'login' ? (
            <LoginForm
              onSuccess={handleSuccess}
              onToggleMode={toggleMode}
            />
          ) : (
            <SignupForm
              onSuccess={handleSuccess}
              onToggleMode={toggleMode}
            />
          )}
        </div>
      </div>
      
      <div className="modal-backdrop" onClick={onClose}>
        <div>close</div>
      </div>
    </div>
  )
}