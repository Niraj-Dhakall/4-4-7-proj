import { render, screen } from '@/test-utils/test-utils'
import userEvent from '@testing-library/user-event'
import { useSearchParams } from 'next/navigation'
import ApplicationAlert from '../ApplicationAlert'


jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}))

const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>

describe('ApplicationAlert', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders nothing when no applied status is present', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn(() => null),
    } as any)

    const { container } = render(<ApplicationAlert />)
    expect(container.firstChild).toBeNull()
  })

  it('renders success message when applied=success', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn((key) => {
        if (key === 'applied') return 'success'
        return null
      }),
    } as any)

    render(<ApplicationAlert />)

    expect(screen.getByText('Success!')).toBeInTheDocument()
    expect(screen.getByText('Your application has been submitted.')).toBeInTheDocument()
  })

  it('renders error message with custom message when applied=error', () => {
    const customMessage = 'Custom error message'
    mockUseSearchParams.mockReturnValue({
      get: jest.fn((key) => {
        if (key === 'applied') return 'error'
        if (key === 'message') return encodeURIComponent(customMessage)
        return null
      }),
    } as any)

    render(<ApplicationAlert />)

    expect(screen.getByText('Error!')).toBeInTheDocument()
    expect(screen.getByText(customMessage)).toBeInTheDocument()
  })

  it('renders error message with default message when no custom message provided', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn((key) => {
        if (key === 'applied') return 'error'
        return null
      }),
    } as any)

    render(<ApplicationAlert />)

    expect(screen.getByText('Error!')).toBeInTheDocument()
    expect(screen.getByText('Failed to submit application.')).toBeInTheDocument()
  })

  it('closes success message when close button is clicked', async () => {
    const user = userEvent.setup()

    mockUseSearchParams.mockReturnValue({
      get: jest.fn((key) => {
        if (key === 'applied') return 'success'
        return null
      }),
    } as any)

    render(<ApplicationAlert />)

    expect(screen.getByText('Success!')).toBeInTheDocument()

    const closeButton = screen.getByRole('button')
    await user.click(closeButton)

    expect(screen.queryByText('Success!')).not.toBeInTheDocument()
  })

  it('closes error message when close button is clicked', async () => {
    const user = userEvent.setup()

    mockUseSearchParams.mockReturnValue({
      get: jest.fn((key) => {
        if (key === 'applied') return 'error'
        return null
      }),
    } as any)

    render(<ApplicationAlert />)

    expect(screen.getByText('Error!')).toBeInTheDocument()

    const closeButton = screen.getByRole('button')
    await user.click(closeButton)

    expect(screen.queryByText('Error!')).not.toBeInTheDocument()
  })

  it('decodes URL-encoded error messages correctly', () => {
    const customMessage = 'Error with special chars: & = ?'

    mockUseSearchParams.mockReturnValue({
      get: jest.fn((key) => {
        if (key === 'applied') return 'error'
        if (key === 'message') return encodeURIComponent(customMessage)
        return null
      }),
    } as any)

    render(<ApplicationAlert />)

    expect(screen.getByText(customMessage)).toBeInTheDocument()
  })
})
