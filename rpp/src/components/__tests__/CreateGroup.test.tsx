import { render, screen } from "@/test-utils/test-utils";
import userEvent from "@testing-library/user-event";
import { useSearchParams } from "next/navigation";
import CreateGroup from "../CreateGroup";
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

describe("CreateGroup", () => {
    it("renders correctly with correct fiels", () => {
        render(<CreateGroup />);
        const groupName = screen.getByPlaceholderText("Group Name");
        expect(groupName).toBeInTheDocument();
        const groupleader = screen.getByText("Who will be group leader?");
        expect(groupleader).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();
    });

    it("accepts and updates text", async () => {
        render(<CreateGroup />);

        const groupName = screen.getByLabelText("Group Name");
        await userEvent.type(groupName, "Test name");
        expect(groupName).toHaveValue("Test name");
    });
});
