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
import { myFunction } from "../myModule";
import prisma from "../prisma";

jest.mock("../prisma", () => ({
    __esModule: true,
    default: {
        model: {
            findFirst: jest.fn(),
        },
    },
}));

describe("myFunction", () => {
    it("should return expected result", async () => {
        (prisma.model.findFirst as jest.Mock).mockResolvedValue({ id: "1" });

        const result = await myFunction();
        expect(result).toBeDefined();
    });
});
```

### API Route Testing Example

```typescript
import { NextRequest } from "next/server";
import { GET } from "../route";
import { getServerSession } from "next-auth";

jest.mock("next-auth");

describe("GET /api/my-route", () => {
    it("should return data when authenticated", async () => {
        (getServerSession as jest.Mock).mockResolvedValue({
            user: { id: "123", userType: "student" },
        });

        const request = new NextRequest("http://localhost:3000/api/my-route");
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toBeDefined();
    });
});
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
    mockAdminSession,
} from "@/test-utils/test-utils";
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

# Complete Jest Testing Guide

## Component Rendering Tests

### Basic rendering

```javascript
test("renders component without crashing", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
});

test("renders with props", () => {
    render(<MyComponent title="Test Title" />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
});
```

---

## Text Input Tests

### Basic input interaction

```javascript
test("handles text input correctly", () => {
    render(<SearchBar />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "test query" } });
    expect(input.value).toBe("test query");
});

test("calls onChange handler", () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "new text" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
});
```

---

## Button Click Tests

```javascript
test("button click triggers function", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
});

test("button is disabled", () => {
    render(<Button disabled>Submit</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
});
```

---

## Form Submission Tests

```javascript
test("submits form with correct data", () => {
    const handleSubmit = jest.fn();
    render(<LoginForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
    });
});
```

---

## Async/Loading Tests

### Testing loading states

```javascript
test("shows loading spinner initially", () => {
    render(<DataComponent />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
});

test("displays data after loading", async () => {
    render(<DataComponent />);

    // Wait for loading to finish
    await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Data loaded")).toBeInTheDocument();
});

test("handles async data fetching", async () => {
    render(<UserList />);

    const user = await screen.findByText("John Doe");
    expect(user).toBeInTheDocument();
});
```

---

## API/Fetch Tests

```javascript
test("fetches and displays users", async () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () =>
                Promise.resolve([
                    { id: 1, name: "John" },
                    { id: 2, name: "Jane" },
                ]),
        })
    );

    render(<UserList />);

    await waitFor(() => {
        expect(screen.getByText("John")).toBeInTheDocument();
        expect(screen.getByText("Jane")).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledTimes(1);
});

test("handles API error", async () => {
    global.fetch = jest.fn(() => Promise.reject("API error"));

    render(<UserList />);

    const errorMessage = await screen.findByText(/error/i);
    expect(errorMessage).toBeInTheDocument();
});
```

---

## Conditional Rendering Tests

```javascript
test("shows content when logged in", () => {
    render(<Dashboard isLoggedIn={true} />);
    expect(screen.getByText("Welcome back!")).toBeInTheDocument();
});

test("shows login prompt when not logged in", () => {
    render(<Dashboard isLoggedIn={false} />);
    expect(screen.getByText("Please log in")).toBeInTheDocument();
});
```

---

## State Management Tests

```javascript
test("toggles visibility on click", () => {
    render(<ToggleComponent />);

    const button = screen.getByText("Toggle");
    expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByText("Hidden content")).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
});

test("updates counter correctly", () => {
    render(<Counter />);

    expect(screen.getByText("Count: 0")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Increment"));
    expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
```

---

## Navigation/Routing Tests

```javascript
test("navigates to correct route on click", () => {
    const mockNavigate = jest.fn();
    jest.mock("react-router-dom", () => ({
        ...jest.requireActual("react-router-dom"),
        useNavigate: () => mockNavigate,
    }));

    render(<NavButton />);
    fireEvent.click(screen.getByText("Go to Home"));

    expect(mockNavigate).toHaveBeenCalledWith("/home");
});
```

---

## List Rendering Tests

```javascript
test("renders list of items", () => {
    const items = ["Item 1", "Item 2", "Item 3"];
    render(<ItemList items={items} />);

    items.forEach((item) => {
        expect(screen.getByText(item)).toBeInTheDocument();
    });
});

test("renders empty state when no items", () => {
    render(<ItemList items={[]} />);
    expect(screen.getByText("No items found")).toBeInTheDocument();
});
```

---

## Dropdown/Select Tests

```javascript
test("handles select change", () => {
    const handleChange = jest.fn();
    render(<Select onChange={handleChange} />);

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "option2" } });

    expect(handleChange).toHaveBeenCalledWith("option2");
});
```

---

## Checkbox/Radio Tests

```javascript
test("handles checkbox toggle", () => {
    render(<Checkbox label="Accept terms" />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
});

test("radio button selection", () => {
    render(<RadioGroup />);

    const option1 = screen.getByLabelText("Option 1");
    const option2 = screen.getByLabelText("Option 2");

    fireEvent.click(option1);
    expect(option1).toBeChecked();
    expect(option2).not.toBeChecked();
});
```

---

## Error Boundary Tests

```javascript
test("catches and displays errors", () => {
    const ThrowError = () => {
        throw new Error("Test error");
    };

    render(
        <ErrorBoundary>
            <ThrowError />
        </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
});
```

---

## Modal/Dialog Tests

```javascript
test("opens and closes modal", () => {
    render(<ModalComponent />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Open Modal"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
```

---

## Accessibility Tests

```javascript
test("has proper ARIA labels", () => {
    render(<SearchBar />);
    expect(screen.getByLabelText("Search")).toBeInTheDocument();
});

test("keyboard navigation works", () => {
    render(<Menu />);
    const firstItem = screen.getByText("Item 1");

    firstItem.focus();
    expect(firstItem).toHaveFocus();
});
```

---

## Snapshot Tests

```javascript
test("matches snapshot", () => {
    const { container } = render(<MyComponent title="Test" />);
    expect(container).toMatchSnapshot();
});
```

---

## Timer/Debounce Tests

```javascript
test("debounces search input", () => {
    jest.useFakeTimers();
    const handleSearch = jest.fn();

    render(<SearchBar onSearch={handleSearch} />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "test" } });
    expect(handleSearch).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);
    expect(handleSearch).toHaveBeenCalledWith("test");

    jest.useRealTimers();
});
```

---

## Context/Provider Tests

```javascript
test("uses context value correctly", () => {
    const TestComponent = () => {
        const { user } = useAuth();
        return <div>{user.name}</div>;
    };

    render(
        <AuthProvider value={{ user: { name: "John" } }}>
            <TestComponent />
        </AuthProvider>
    );

    expect(screen.getByText("John")).toBeInTheDocument();
});

test("updates context value", () => {
    const TestComponent = () => {
        const { count, increment } = useCounter();
        return (
            <div>
                <span>Count: {count}</span>
                <button onClick={increment}>Increment</button>
            </div>
        );
    };

    render(
        <CounterProvider>
            <TestComponent />
        </CounterProvider>
    );

    expect(screen.getByText("Count: 0")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Increment"));
    expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
```

---

## Custom Hook Tests

```javascript
import { renderHook, act } from "@testing-library/react";

test("useCounter increments correctly", () => {
    const { result } = renderHook(() => useCounter());

    expect(result.current.count).toBe(0);

    act(() => {
        result.current.increment();
    });

    expect(result.current.count).toBe(1);
});

test("useCounter with initial value", () => {
    const { result } = renderHook(() => useCounter(10));

    expect(result.current.count).toBe(10);
});

test("useFetch returns data", async () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ data: "test" }),
        })
    );

    const { result, waitForNextUpdate } = renderHook(() =>
        useFetch("https://api.example.com/data")
    );

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual({ data: "test" });
});
```

---

## File Upload Tests

```javascript
test("handles file upload", () => {
    const handleUpload = jest.fn();
    render(<FileUpload onUpload={handleUpload} />);

    const file = new File(["content"], "test.txt", { type: "text/plain" });
    const input = screen.getByLabelText(/upload/i);

    fireEvent.change(input, { target: { files: [file] } });

    expect(handleUpload).toHaveBeenCalledWith(file);
});

test("validates file type", () => {
    render(<FileUpload acceptedTypes={["image/png", "image/jpeg"]} />);

    const invalidFile = new File(["content"], "test.txt", {
        type: "text/plain",
    });
    const input = screen.getByLabelText(/upload/i);

    fireEvent.change(input, { target: { files: [invalidFile] } });

    expect(screen.getByText(/invalid file type/i)).toBeInTheDocument();
});
```

---

## Drag and Drop Tests

```javascript
test("handles drag and drop", () => {
    const handleDrop = jest.fn();
    render(<DropZone onDrop={handleDrop} />);

    const dropZone = screen.getByTestId("drop-zone");
    const file = new File(["content"], "test.txt", { type: "text/plain" });

    fireEvent.dragEnter(dropZone);
    fireEvent.dragOver(dropZone);
    fireEvent.drop(dropZone, {
        dataTransfer: { files: [file] },
    });

    expect(handleDrop).toHaveBeenCalledWith([file]);
});
```

---

## LocalStorage Tests

```javascript
test("saves to localStorage", () => {
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

    render(<SaveButton data={{ name: "Test" }} />);
    fireEvent.click(screen.getByText("Save"));

    expect(setItemSpy).toHaveBeenCalledWith(
        "userData",
        JSON.stringify({ name: "Test" })
    );

    setItemSpy.mockRestore();
});

test("loads from localStorage", () => {
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockReturnValue(JSON.stringify({ name: "Test" }));

    render(<UserProfile />);

    expect(screen.getByText("Test")).toBeInTheDocument();

    getItemSpy.mockRestore();
});

test("clears localStorage", () => {
    const clearSpy = jest.spyOn(Storage.prototype, "clear");

    render(<LogoutButton />);
    fireEvent.click(screen.getByText("Logout"));

    expect(clearSpy).toHaveBeenCalled();

    clearSpy.mockRestore();
});
```

---

## Window/Document Event Tests

```javascript
test("handles window resize", () => {
    render(<ResponsiveComponent />);

    act(() => {
        global.innerWidth = 500;
        global.dispatchEvent(new Event("resize"));
    });

    expect(screen.getByText("Mobile View")).toBeInTheDocument();
});

test("handles scroll event", () => {
    render(<ScrollToTop />);

    act(() => {
        window.scrollY = 1000;
        global.dispatchEvent(new Event("scroll"));
    });

    expect(screen.getByTestId("scroll-button")).toBeVisible();
});

test("handles beforeunload event", () => {
    const mockBeforeUnload = jest.fn();
    window.addEventListener("beforeunload", mockBeforeUnload);

    render(<UnsavedChanges hasChanges={true} />);

    const event = new Event("beforeunload");
    window.dispatchEvent(event);

    expect(mockBeforeUnload).toHaveBeenCalled();
});
```

---

## Animation Tests

```javascript
test("applies animation class", () => {
    render(<AnimatedComponent />);
    const element = screen.getByTestId("animated-element");

    expect(element).toHaveClass("animate-fade-in");
});

test("removes animation class after completion", async () => {
    jest.useFakeTimers();
    render(<AnimatedComponent />);

    const element = screen.getByTestId("animated-element");

    act(() => {
        jest.advanceTimersByTime(1000);
    });

    expect(element).not.toHaveClass("animate-fade-in");

    jest.useRealTimers();
});
```

---

## Tooltip/Popover Tests

```javascript
test("shows tooltip on hover", async () => {
    render(<TooltipComponent />);

    const trigger = screen.getByText("Hover me");

    fireEvent.mouseEnter(trigger);

    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent("Tooltip text");
});

test("hides tooltip on mouse leave", async () => {
    render(<TooltipComponent />);

    const trigger = screen.getByText("Hover me");

    fireEvent.mouseEnter(trigger);
    await screen.findByRole("tooltip");

    fireEvent.mouseLeave(trigger);

    await waitFor(() => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
});
```

---

## Pagination Tests

```javascript
test("navigates to next page", () => {
    const handlePageChange = jest.fn();
    render(
        <Pagination
            currentPage={1}
            totalPages={5}
            onPageChange={handlePageChange}
        />
    );

    fireEvent.click(screen.getByLabelText("Next page"));

    expect(handlePageChange).toHaveBeenCalledWith(2);
});

test("disables previous on first page", () => {
    render(<Pagination currentPage={1} totalPages={5} />);

    expect(screen.getByLabelText("Previous page")).toBeDisabled();
});

test("disables next on last page", () => {
    render(<Pagination currentPage={5} totalPages={5} />);

    expect(screen.getByLabelText("Next page")).toBeDisabled();
});
```

---

## Search/Filter Tests

```javascript
test("filters list by search term", () => {
    const items = ["Apple", "Banana", "Cherry"];
    render(<SearchableList items={items} />);

    const searchInput = screen.getByPlaceholderText("Search...");

    fireEvent.change(searchInput, { target: { value: "ban" } });

    expect(screen.getByText("Banana")).toBeInTheDocument();
    expect(screen.queryByText("Apple")).not.toBeInTheDocument();
    expect(screen.queryByText("Cherry")).not.toBeInTheDocument();
});

test("shows no results message", () => {
    const items = ["Apple", "Banana", "Cherry"];
    render(<SearchableList items={items} />);

    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "xyz" } });

    expect(screen.getByText("No results found")).toBeInTheDocument();
});
```

---

## Sorting Tests

```javascript
test("sorts table by column", () => {
    const data = [
        { name: "Charlie", age: 30 },
        { name: "Alice", age: 25 },
        { name: "Bob", age: 35 },
    ];

    render(<SortableTable data={data} />);

    fireEvent.click(screen.getByText("Name"));

    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Alice");
    expect(rows[2]).toHaveTextContent("Bob");
    expect(rows[3]).toHaveTextContent("Charlie");
});

test("toggles sort direction", () => {
    const data = [
        { name: "Alice", age: 25 },
        { name: "Bob", age: 35 },
    ];

    render(<SortableTable data={data} />);

    const nameHeader = screen.getByText("Name");

    // First click - ascending
    fireEvent.click(nameHeader);
    expect(screen.getAllByRole("row")[1]).toHaveTextContent("Alice");

    // Second click - descending
    fireEvent.click(nameHeader);
    expect(screen.getAllByRole("row")[1]).toHaveTextContent("Bob");
});
```

---

## Infinite Scroll Tests

```javascript
test("loads more items on scroll", async () => {
    render(<InfiniteScrollList />);

    expect(screen.getAllByRole("listitem")).toHaveLength(10);

    const scrollContainer = screen.getByTestId("scroll-container");

    act(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
        fireEvent.scroll(scrollContainer);
    });

    await waitFor(() => {
        expect(screen.getAllByRole("listitem")).toHaveLength(20);
    });
});
```

---

## Form Validation Tests

```javascript
test("shows validation error for empty required field", async () => {
    render(<RegistrationForm />);

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
});

test("shows validation error for invalid email", async () => {
    render(<RegistrationForm />);

    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: "invalidemail" } });
    fireEvent.blur(emailInput);

    expect(await screen.findByText("Invalid email format")).toBeInTheDocument();
});

test("clears validation error on valid input", async () => {
    render(<RegistrationForm />);

    const emailInput = screen.getByLabelText("Email");

    fireEvent.change(emailInput, { target: { value: "invalid" } });
    fireEvent.blur(emailInput);

    await screen.findByText("Invalid email format");

    fireEvent.change(emailInput, { target: { value: "valid@example.com" } });

    await waitFor(() => {
        expect(
            screen.queryByText("Invalid email format")
        ).not.toBeInTheDocument();
    });
});
```

---

## Multi-Step Form Tests

```javascript
test("navigates through form steps", () => {
    render(<MultiStepForm />);

    expect(screen.getByText("Step 1")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText("Step 2")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Back"));
    expect(screen.getByText("Step 1")).toBeInTheDocument();
});

test("validates current step before proceeding", () => {
    render(<MultiStepForm />);

    fireEvent.click(screen.getByText("Next"));

    expect(screen.getByText("Please complete all fields")).toBeInTheDocument();
    expect(screen.getByText("Step 1")).toBeInTheDocument();
});
```

---

## Date Picker Tests

```javascript
test("selects date", () => {
    const handleDateChange = jest.fn();
    render(<DatePicker onChange={handleDateChange} />);

    fireEvent.click(screen.getByLabelText("Select date"));
    fireEvent.click(screen.getByText("15"));

    expect(handleDateChange).toHaveBeenCalled();
});

test("disables past dates", () => {
    render(<DatePicker disablePast />);

    fireEvent.click(screen.getByLabelText("Select date"));

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const pastDateButton = screen.getByText(yesterday.getDate().toString());
    expect(pastDateButton).toBeDisabled();
});
```

---

## Tab Navigation Tests

```javascript
test("switches tabs on click", () => {
    render(<TabPanel />);

    expect(screen.getByText("Tab 1 Content")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Tab 2" }));

    expect(screen.getByText("Tab 2 Content")).toBeInTheDocument();
    expect(screen.queryByText("Tab 1 Content")).not.toBeInTheDocument();
});

test("keyboard navigation between tabs", () => {
    render(<TabPanel />);

    const tab1 = screen.getByRole("tab", { name: "Tab 1" });
    const tab2 = screen.getByRole("tab", { name: "Tab 2" });

    tab1.focus();
    fireEvent.keyDown(tab1, { key: "ArrowRight" });

    expect(tab2).toHaveFocus();
});
```

---

## Accordion Tests

```javascript
test("expands and collapses accordion item", () => {
    render(<Accordion />);

    const header = screen.getByText("Section 1");

    expect(screen.queryByText("Section 1 content")).not.toBeVisible();

    fireEvent.click(header);
    expect(screen.getByText("Section 1 content")).toBeVisible();

    fireEvent.click(header);
    expect(screen.queryByText("Section 1 content")).not.toBeVisible();
});

test("only one section open at a time", () => {
    render(<Accordion allowMultiple={false} />);

    fireEvent.click(screen.getByText("Section 1"));
    expect(screen.getByText("Section 1 content")).toBeVisible();

    fireEvent.click(screen.getByText("Section 2"));
    expect(screen.getByText("Section 2 content")).toBeVisible();
    expect(screen.queryByText("Section 1 content")).not.toBeVisible();
});
```

---

## Carousel/Slider Tests

```javascript
test("navigates to next slide", () => {
    render(<Carousel slides={["Slide 1", "Slide 2", "Slide 3"]} />);

    expect(screen.getByText("Slide 1")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Next slide"));

    expect(screen.getByText("Slide 2")).toBeInTheDocument();
});

test("auto-advances slides", () => {
    jest.useFakeTimers();
    render(
        <Carousel slides={["Slide 1", "Slide 2"]} autoPlay interval={3000} />
    );

    expect(screen.getByText("Slide 1")).toBeInTheDocument();

    act(() => {
        jest.advanceTimersByTime(3000);
    });

    expect(screen.getByText("Slide 2")).toBeInTheDocument();

    jest.useRealTimers();
});
```

---

## Notification/Toast Tests

```javascript
test("displays notification", () => {
    render(<NotificationSystem />);

    act(() => {
        fireEvent.click(screen.getByText("Show Notification"));
    });

    expect(screen.getByRole("alert")).toHaveTextContent("Success!");
});

test("auto-dismisses notification after timeout", async () => {
    jest.useFakeTimers();
    render(<NotificationSystem />);

    act(() => {
        fireEvent.click(screen.getByText("Show Notification"));
    });

    expect(screen.getByRole("alert")).toBeInTheDocument();

    act(() => {
        jest.advanceTimersByTime(5000);
    });

    await waitFor(() => {
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    jest.useRealTimers();
});
```

---

## Copy to Clipboard Tests

```javascript
test("copies text to clipboard", async () => {
    Object.assign(navigator, {
        clipboard: {
            writeText: jest.fn().mockResolvedValue(undefined),
        },
    });

    render(<CopyButton text="Copy this text" />);

    fireEvent.click(screen.getByText("Copy"));

    await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
            "Copy this text"
        );
    });

    expect(screen.getByText("Copied!")).toBeInTheDocument();
});
```

---

## WebSocket Tests

```javascript
test("receives WebSocket message", async () => {
    const mockWebSocket = {
        send: jest.fn(),
        close: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
    };

    global.WebSocket = jest.fn(() => mockWebSocket);

    render(<ChatComponent />);

    // Simulate receiving a message
    const messageHandler = mockWebSocket.addEventListener.mock.calls.find(
        (call) => call[0] === "message"
    )[1];

    act(() => {
        messageHandler({ data: JSON.stringify({ text: "Hello!" }) });
    });

    expect(screen.getByText("Hello!")).toBeInTheDocument();
});
```

---

## Common Matchers Reference

```javascript
// Existence
expect(element).toBeInTheDocument();
expect(element).not.toBeInTheDocument();
expect(element).toBeNull();
expect(element).toBeDefined();
expect(element).toBeUndefined();

// Visibility
expect(element).toBeVisible();
expect(element).not.toBeVisible();
expect(element).toBeEmptyDOMElement();

// Text content
expect(element).toHaveTextContent("text");
expect(element).toContainHTML("<span>text</span>");
expect(element).toHaveAccessibleName("name");
expect(element).toHaveAccessibleDescription("description");

// Form elements
expect(input).toHaveValue("value");
expect(input).toHaveDisplayValue("displayed value");
expect(checkbox).toBeChecked();
expect(checkbox).not.toBeChecked();
expect(checkbox).toBePartiallyChecked();
expect(button).toBeDisabled();
expect(button).toBeEnabled();
expect(input).toBeRequired();
expect(input).toBeInvalid();
expect(input).toBeValid();

// Classes and attributes
expect(element).toHaveClass("active");
expect(element).toHaveClass("btn", "btn-primary");
expect(element).toHaveAttribute("href", "/home");
expect(element).toHaveAttribute("data-testid");
expect(element).toHaveStyle("color: red");
expect(element).toHaveStyle({ color: "red", fontSize: "16px" });

// Focus
expect(element).toHaveFocus();
expect(element).not.toHaveFocus();

// Form-specific
expect(select).toHaveFormValues({ username: "john" });
expect(form).toHaveFormValues({
    email: "test@example.com",
    password: "pass123",
});

// Function calls (with jest.fn())
expect(mockFunction).toHaveBeenCalled();
expect(mockFunction).toHaveBeenCalledTimes(3);
expect(mockFunction).toHaveBeenCalledWith("arg1", "arg2");
expect(mockFunction).toHaveBeenLastCalledWith("lastArg");
expect(mockFunction).toHaveBeenNthCalledWith(2, "secondCallArg");
expect(mockFunction).toHaveReturned();
expect(mockFunction).toHaveReturnedWith("returnValue");

// Arrays and objects
expect(array).toContain("item");
expect(array).toContainEqual({ id: 1 });
expect(array).toHaveLength(5);
expect(object).toEqual({ key: "value" });
expect(object).toMatchObject({ key: "value" });
expect(object).toHaveProperty("key");
expect(object).toHaveProperty("key", "value");

// Strings
expect(string).toMatch(/pattern/);
expect(string).toMatch("substring");
expect(string).toContain("substring");

// Numbers
expect(number).toBeGreaterThan(5);
expect(number).toBeGreaterThanOrEqual(5);
expect(number).toBeLessThan(10);
expect(number).toBeLessThanOrEqual(10);
expect(number).toBeCloseTo(5.5, 1);

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();
expect(value).toBeNaN();

// Promises (async)
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow(error);

// Error handling
expect(() => fn()).toThrow();
expect(() => fn()).toThrow(Error);
expect(() => fn()).toThrow("error message");
expect(() => fn()).toThrow(/pattern/);
```

---

## Query Priority Guide

```javascript
// Preferred queries (in order of priority)
screen.getByRole('button', { name: /submit/i });          // BEST - most accessible
screen.getByLabelText('Email');                            // Good for forms
screen.getByPlaceholderText('Enter email');                // Fallback for inputs
screen.getByText('Hello World');                           // Good for non-interactive
screen.getByDisplayValue('Current value');                 // For form elements with value

// Use only when necessary
screen.getByAltText('profile picture');                    // For images
screen.getByTitle('tooltip');                              // For title attributes

// Last resort
screen.getByTestId('custom-element');                      // When nothing else works

// Query variants
getBy...     // Throws error if not found
queryBy...   // Returns null if not found (use for asserting non-existence)
findBy...    // Returns promise, waits for element (use for async)

// Multiple elements
getAllBy...
queryAllBy...
findAllBy...
```

---

## Setup and Teardown

```javascript
// Before each test
beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Reset localStorage
    localStorage.clear();

    // Reset fetch
    global.fetch = jest.fn();
});

// After each test
afterEach(() => {
    // Cleanup
    cleanup();

    // Restore mocks
    jest.restoreAllMocks();
});

// Before all tests
beforeAll(() => {
    // Setup that runs once
    global.matchMedia =
        global.matchMedia ||
        function () {
            return {
                addListener: jest.fn(),
                removeListener: jest.fn(),
            };
        };
});

// After all tests
afterAll(() => {
    // Final cleanup
    jest.clearAllTimers();
});
```

---

## Mock Setup Examples

### Mocking modules

```javascript
// Mock entire module
jest.mock("./api");

// Mock with custom implementation
jest.mock("./api", () => ({
    fetchUser: jest.fn(() => Promise.resolve({ name: "John" })),
}));

// Mock default export
jest.mock("./Button", () => ({
    __esModule: true,
    default: () => <div>Mocked Button</div>,
}));
```

### Mocking functions

```javascript
// Create mock function
const mockFn = jest.fn();

// Mock implementation
const mockFn = jest.fn((x) => x * 2);

// Mock return value
mockFn.mockReturnValue(42);
mockFn.mockReturnValueOnce(1).mockReturnValueOnce(2);

// Mock resolved/rejected value
mockFn.mockResolvedValue({ data: "success" });
mockFn.mockRejectedValue(new Error("failed"));

// Mock implementation
mockFn.mockImplementation((x) => x + 1);
mockFn.mockImplementationOnce((x) => x + 1);
```

---

## Best Practices

1. **Test user behavior, not implementation details**
2. **Use semantic queries (getByRole, getByLabelText) over getByTestId**
3. **Test accessibility as you go**
4. **Keep tests isolated and independent**
5. **Use async utilities (waitFor, findBy) for async operations**
6. **Don't test third-party libraries**
7. **Mock external dependencies (APIs, modules)**
8. **Write descriptive test names**
9. **Follow AAA pattern: Arrange, Act, Assert**
10. **Use data-testid only as a last resort**

---

## Common Testing Patterns

### Testing with React Router

```javascript
import { MemoryRouter } from "react-router-dom";

test("navigates on click", () => {
    render(
        <MemoryRouter initialEntries={["/"]}>
            <App />
        </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Go to About"));
    expect(screen.getByText("About Page")).toBeInTheDocument();
});
```

### Testing with Redux

```javascript
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

test("updates Redux state", () => {
    const store = configureStore({
        reducer: {
            counter: counterReducer,
        },
    });

    render(
        <Provider store={store}>
            <Counter />
        </Provider>
    );

    fireEvent.click(screen.getByText("Increment"));
    expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
```

### Testing with React Query

```javascript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

test("fetches data with React Query", async () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });

    render(
        <QueryClientProvider client={queryClient}>
            <UserList />
        </QueryClientProvider>
    );

    expect(await screen.findByText("John")).toBeInTheDocument();
});
```

---

## Integration Test Example

```javascript
describe("Complete user flow", () => {
    test("user can register, login, and view profile", async () => {
        // Mock API
        global.fetch = jest.fn((url) => {
            if (url.includes("/register")) {
                return Promise.resolve({
                    json: () => Promise.resolve({ success: true }),
                });
            }
            if (url.includes("/login")) {
                return Promise.resolve({
                    json: () => Promise.resolve({ token: "abc123" }),
                });
            }
            if (url.includes("/profile")) {
                return Promise.resolve({
                    json: () =>
                        Promise.resolve({
                            name: "John",
                            email: "john@example.com",
                        }),
                });
            }
        });

        render(<App />);

        // Navigate to register
        fireEvent.click(screen.getByText("Sign Up"));

        // Fill registration form
        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "john@example.com" },
        });
        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "password123" },
        });
        fireEvent.click(screen.getByRole("button", { name: /register/i }));

        // Wait for redirect and login
        await waitFor(() => {
            expect(screen.getByText("Login")).toBeInTheDocument();
        });

        // Login
        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "john@example.com" },
        });
        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "password123" },
        });
        fireEvent.click(screen.getByRole("button", { name: /login/i }));

        // Verify profile page
        expect(await screen.findByText("john@example.com")).toBeInTheDocument();
    });
});
```

---

## Performance Testing

```javascript
test("renders large list efficiently", () => {
    const items = Array.from({ length: 1000 }, (_, i) => `Item ${i}`);

    const startTime = performance.now();
    render(<VirtualizedList items={items} />);
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(1000); // Should render in less than 1s
});
```

---

## Visual Regression Testing (with jest-image-snapshot)

```javascript
test("matches screenshot", () => {
    const { container } = render(<Component />);
    expect(container).toMatchImageSnapshot();
});
```

---

## E2E-Style Tests in Jest

```javascript
test("complete checkout flow", async () => {
    render(<EcommerceApp />);

    // Browse products
    expect(screen.getByText("Products")).toBeInTheDocument();

    // Add to cart
    fireEvent.click(screen.getAllByText("Add to Cart")[0]);

    // View cart
    fireEvent.click(screen.getByText("Cart (1)"));
    expect(screen.getByText("Your Cart")).toBeInTheDocument();

    // Proceed to checkout
    fireEvent.click(screen.getByText("Checkout"));

    // Fill shipping info
    fireEvent.change(screen.getByLabelText("Address"), {
        target: { value: "123 Main St" },
    });

    // Submit order
    fireEvent.click(screen.getByText("Place Order"));

    // Verify confirmation
    expect(await screen.findByText("Order Confirmed")).toBeInTheDocument();
});
```

---
