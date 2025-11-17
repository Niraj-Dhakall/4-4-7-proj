import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'

// Mock session for testing
const mockSession = {
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    userType: 'student' as const
  }
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  session?: any
}

// Custom render function that includes providers
function customRender(
  ui: ReactElement,
  { session = mockSession, ...renderOptions }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <SessionProvider session={session}>
        {children}
      </SessionProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Re-export everything from React Testing Library
export * from '@testing-library/react'
export { customRender as render }

// Export mock data for use in tests
export const mockStudentSession = {
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  user: {
    id: 'student-id',
    email: 'student@example.com',
    name: 'Test Student',
    userType: 'student' as const
  }
}

export const mockStakeholderSession = {
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  user: {
    id: 'stakeholder-id',
    email: 'stakeholder@example.com',
    name: 'Test Stakeholder',
    userType: 'stakeholder' as const
  }
}

export const mockAdminSession = {
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  user: {
    id: 'admin-id',
    email: 'admin@example.com',
    name: 'Test Admin',
    userType: 'admin' as const
  }
}
