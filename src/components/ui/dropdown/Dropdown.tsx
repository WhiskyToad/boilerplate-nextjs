'use client'

import { DropdownUI, DropdownUIProps } from './DropdownUI'

export interface DropdownProps extends DropdownUIProps {
  // Extended props can be added here in the future
  className?: string
}

export function Dropdown(props: DropdownProps) {
  return <DropdownUI {...props} />
}

export type { DropdownOption } from './DropdownUI'