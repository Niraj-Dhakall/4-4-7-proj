import { render, screen } from '@/test-utils/test-utils'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import GoBackButton from '../GoBackButton'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('GoBackButton', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    mockPush.mockClear()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  it('renders the go back button with correct text', () => {
    render(<GoBackButton route="/portal" />)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Go Back')
  })

  it('navigates to the specified route when clicked', async () => {
    const user = userEvent.setup()
    render(<GoBackButton route="/portal" />)

    const button = screen.getByRole('button')
    await user.click(button)

    expect(mockPush).toHaveBeenCalledWith('/portal')
    expect(mockPush).toHaveBeenCalledTimes(1)
  })

  it('applies correct styling classes', () => {
    render(<GoBackButton route="/dashboard" />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('text-slate-500')
    expect(button).toHaveClass('font-semibold')
    expect(button).toHaveClass('hover:cursor-pointer')
  })

  it('works with different route paths', async () => {
    const user = userEvent.setup()
    const customRoute = '/profile/student'

    render(<GoBackButton route={customRoute} />)

    const button = screen.getByRole('button')
    await user.click(button)

    expect(mockPush).toHaveBeenCalledWith(customRoute)
  })
})
