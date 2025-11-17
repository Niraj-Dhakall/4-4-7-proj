# Testing Guide

This project uses Jest and React Testing Library for testing.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode (for continuous integration)
npm run test:ci
```

## Test Structure

Tests are organized using the following conventions:

### Component Tests
- Located in `src/components/__tests__/`
- File naming: `ComponentName.test.tsx`
- Tests user interactions, rendering, and props

### Library/Utility Tests
- Located in `lib/__tests__/`
- File naming: `moduleName.test.ts`
- Tests business logic and database operations

### API Route Tests
- Located in `src/app/api/[resource]/__tests__/`
- File naming: `routeName.test.ts`
- Tests HTTP endpoints, authentication, and responses

## Writing Tests

### Component Testing Example

```typescript
import { render, screen } from '@/test-utils/test-utils'
import userEvent from '@testing-library/user-event'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('should handle user interactions', async () => {
    const user = userEvent.setup()
    render(<MyComponent />)

    await user.click(screen.getByRole('button'))
    expect(screen.getByText('Clicked!')).toBeInTheDocument()
  })
})
```

### Library Function Testing Example

```typescript
import { myFunction } from '../myModule'
import prisma from '../prisma'

jest.mock('../prisma', () => ({
  __esModule: true,
  default: {
    model: {
      findFirst: jest.fn(),
    },
  },
}))

describe('myFunction', () => {
  it('should return expected result', async () => {
    (prisma.model.findFirst as jest.Mock).mockResolvedValue({ id: '1' })

    const result = await myFunction()
    expect(result).toBeDefined()
  })
})
```

### API Route Testing Example

```typescript
import { NextRequest } from 'next/server'
import { GET } from '../route'
import { getServerSession } from 'next-auth'

jest.mock('next-auth')

describe('GET /api/my-route', () => {
  it('should return data when authenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: '123', userType: 'student' }
    })

    const request = new NextRequest('http://localhost:3000/api/my-route')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toBeDefined()
  })
})
```

## Test Utilities

### Custom Render with Providers

The project includes a custom render function that wraps components with necessary providers:

```typescript
import { render, mockStudentSession } from '@/test-utils/test-utils'

// Renders with default student session
render(<MyComponent />)

// Renders with custom session
render(<MyComponent />, { session: mockStakeholderSession })
```

### Available Mock Sessions

```typescript
import {
  mockStudentSession,
  mockStakeholderSession,
  mockAdminSession
} from '@/test-utils/test-utils'
```

## Mocked Modules

The following modules are automatically mocked in `jest.setup.ts`:

- **next-auth/react**: `useSession`, `signIn`, `signOut`
- **next/navigation**: `useRouter`, `useSearchParams`, `usePathname`

## Coverage

Coverage reports are generated in the `coverage/` directory.

To view coverage:
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

## Best Practices

1. **Test behavior, not implementation**: Focus on what the user sees and does
2. **Use meaningful test descriptions**: Describe what the test validates
3. **Keep tests isolated**: Each test should be independent
4. **Mock external dependencies**: Database calls, API requests, etc.
5. **Test edge cases**: Empty states, errors, loading states
6. **Use accessible queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`

## Common Testing Patterns

### Testing Async Operations

```typescript
it('should load data', async () => {
  render(<MyComponent />)

  // Wait for element to appear
  expect(await screen.findByText('Loaded')).toBeInTheDocument()
})
```

### Testing Forms

```typescript
it('should submit form', async () => {
  const user = userEvent.setup()
  render(<MyForm />)

  await user.type(screen.getByLabelText('Name'), 'John Doe')
  await user.click(screen.getByRole('button', { name: /submit/i }))

  expect(mockSubmit).toHaveBeenCalled()
})
```

### Testing Error States

```typescript
it('should display error message', async () => {
  mockAPI.mockRejectedValue(new Error('Failed'))

  render(<MyComponent />)

  expect(await screen.findByText(/error/i)).toBeInTheDocument()
})
```

## Troubleshooting

### Tests fail with "Cannot find module"
- Check that `moduleNameMapper` in `jest.config.ts` matches your import aliases
- Ensure all dependencies are installed

### Tests timeout
- Increase timeout in test: `jest.setTimeout(10000)`
- Check for unresolved promises

### Mock not working
- Ensure mock is defined before importing the module that uses it
- Use `jest.clearAllMocks()` in `beforeEach`

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
