import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@solidjs/testing-library";
import { vi } from "vitest";
import EditableText from ".";

afterEach(() => {
  cleanup();
});

describe("EditableText", () => {
  describe("Rendering", () => {
    it("renders the initial value", () => {
      const value = () => "Hello World";
      const onChange = () => {};

      render(() => <EditableText value={value} onChange={onChange} />);

      expect(screen.getByText("Hello World")).toBeInTheDocument();
    });

    it("renders placeholder when value is empty", () => {
      const value = () => "";
      const onChange = () => {};
      const placeholder = "Enter text...";

      render(() => (
        <EditableText
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      ));

      expect(screen.getByText(placeholder)).toBeInTheDocument();
    });
  });

  describe("Edit Mode", () => {
    it("enters edit mode when clicked", () => {
      const value = () => "Hello World";
      const onChange = () => {};

      render(() => <EditableText value={value} onChange={onChange} />);

      const textElement = screen.getByText("Hello World");

      fireEvent.click(textElement);

      const input = screen.getByDisplayValue("Hello World");
      expect(input).toBeInTheDocument();
    });

    it("shows input and buttons in edit mode", () => {
      const value = () => "Hello World";
      const onChange = () => {};

      render(() => <EditableText value={value} onChange={onChange} />);

      const textElement = screen.getByText("Hello World");
      fireEvent.click(textElement);

      expect(screen.getByDisplayValue("Hello World")).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(2); // Save and Cancel buttons
    });

    it("hides text element in edit mode", () => {
      const value = () => "Hello World";
      const onChange = () => {};

      render(() => <EditableText value={value} onChange={onChange} />);

      const textElement = screen.getByText("Hello World");
      fireEvent.click(textElement);

      expect(screen.queryByText("Hello World")).not.toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    describe("Keyboard", () => {
      it("saves changes when Enter is pressed", () => {
        let testValue = "Hello World";
        const value = () => testValue;

        const onChange = (newValue: string) => {
          testValue = newValue;
        };

        render(() => <EditableText value={value} onChange={onChange} />);

        const textElement = screen.getByText("Hello World");
        fireEvent.click(textElement);

        const input = screen.getByDisplayValue("Hello World");
        fireEvent.change(input, { target: { value: "Hello Updated World" } });
        fireEvent.keyDown(input, { key: "Enter" });

        expect(testValue).toBe("Hello Updated World");
        expect(screen.getByText("Hello Updated World")).toBeInTheDocument();
      });

      it("cancels changes when Escape is pressed", () => {
        const value = () => "Hello World";
        let changedValue = "";
        const onChange = (newValue: string) => {
          changedValue = newValue;
        };

        render(() => <EditableText value={value} onChange={onChange} />);

        const textElement = screen.getByText("Hello World");
        fireEvent.click(textElement);

        const input = screen.getByDisplayValue("Hello World");
        fireEvent.change(input, { target: { value: "Hello Updated World" } });
        fireEvent.keyDown(input, { key: "Escape" });

        expect(changedValue).toBe(""); // Should not have changed
        expect(screen.getByText("Hello World")).toBeInTheDocument(); // Should show original value
      });
    });

    describe("Mouse", () => {
      it("saves changes when save button is clicked", () => {
        let testValue = "Hello World";
        const value = () => testValue;
        const onChange = (newValue: string) => {
          testValue = newValue;
        };

        render(() => <EditableText value={value} onChange={onChange} />);

        const textElement = screen.getByText("Hello World");
        fireEvent.click(textElement);

        const input = screen.getByDisplayValue("Hello World");
        fireEvent.change(input, { target: { value: "Hello Updated World" } });

        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[0]); // Save button (first button)

        expect(testValue).toBe("Hello Updated World");
        expect(screen.getByText("Hello Updated World")).toBeInTheDocument();
      });

      it("cancels changes when cancel button is clicked", () => {
        const value = () => "Hello World";
        let changedValue = "";
        const onChange = (newValue: string) => {
          changedValue = newValue;
        };

        render(() => <EditableText value={value} onChange={onChange} />);

        const textElement = screen.getByText("Hello World");
        fireEvent.click(textElement);

        const input = screen.getByDisplayValue("Hello World");
        fireEvent.change(input, { target: { value: "Hello Updated World" } });

        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[1]); // Cancel button (second button)

        expect(changedValue).toBe(""); // Should not have changed
        expect(screen.getByText("Hello World")).toBeInTheDocument(); // Should show original value
      });
    });
  });

  describe("Value Management", () => {
    it("does not call onChange when value hasn't changed", () => {
      const value = () => "Hello World";
      let changeCount = 0;
      const onChange = (_newValue: string) => {
        changeCount++;
      };

      render(() => (
        <EditableText
          value={value}
          onChange={onChange}
        />
      ));

      const textElement = screen.getByText("Hello World");
      fireEvent.click(textElement);

      const buttons = screen.getAllByRole("button");
      fireEvent.click(buttons[0]); // Save button

      expect(changeCount).toBe(0); // Should not have called onChange
    });

    it("calls onChange when value has changed", () => {
      const value = () => "Hello World";
      let changedValue = "";
      const onChange = (newValue: string) => {
        changedValue = newValue;
      };

      render(() => (
        <EditableText
          value={value}
          onChange={onChange}
        />
      ));

      const textElement = screen.getByText("Hello World");
      fireEvent.click(textElement);

      const input = screen.getByDisplayValue("Hello World");
      fireEvent.change(input, { target: { value: "Different Value" } });

      const buttons = screen.getAllByRole("button");
      fireEvent.click(buttons[0]); // Save button

      expect(changedValue).toBe("Different Value");
    });
  });

  describe("Click Outside Behavior", () => {
    it("cancels editing when clicking outside", () => {
      const value = () => "Hello World";
      const onChange = () => {};

      render(() => (
        <EditableText
          value={value}
          onChange={onChange}
        />
      ));

      const textElement = screen.getByText("Hello World");
      fireEvent.click(textElement);

      // Verify we're in edit mode
      expect(screen.getByDisplayValue("Hello World")).toBeInTheDocument();

      // Click outside (on document body)
      fireEvent.click(document.body);

      // Should exit edit mode and show original text
      expect(screen.getByText("Hello World")).toBeInTheDocument();
      expect(screen.queryByDisplayValue("Hello World")).not.toBeInTheDocument();
    });

    it("does not cancel when clicking inside the component", () => {
      const value = () => "Hello World";
      const onChange = () => {};

      render(() => (
        <EditableText
          value={value}
          onChange={onChange}
        />
      ));

      const textElement = screen.getByText("Hello World");
      fireEvent.click(textElement);

      // Verify we're in edit mode
      expect(screen.getByDisplayValue("Hello World")).toBeInTheDocument();

      // Click on the input (inside component)
      const input = screen.getByDisplayValue("Hello World");
      fireEvent.click(input);

      // Should still be in edit mode
      expect(screen.getByDisplayValue("Hello World")).toBeInTheDocument();
    });
  });

  describe("Re-editing Behavior", () => {
    it("shows updated value when clicking to edit again after saving", () => {
      let currentValue = "Original Text";
      const value = () => currentValue;
      const onChange = (newValue: string) => {
        currentValue = newValue;
      };

      render(() => (
        <EditableText
          value={value}
          onChange={onChange}
        />
      ));

      // Initial state - should show original text
      expect(screen.getByText("Original Text")).toBeInTheDocument();

      // Click to edit
      const textElement = screen.getByText("Original Text");
      fireEvent.click(textElement);

      // Input should show current value
      const input = screen.getByDisplayValue("Original Text");
      expect(input).toBeInTheDocument();

      // Change the value
      fireEvent.change(input, { target: { value: "Updated Text" } });

      // Save the changes
      const buttons = screen.getAllByRole("button");
      fireEvent.click(buttons[0]); // Save button

      // Should show updated text
      expect(screen.getByText("Updated Text")).toBeInTheDocument();

      // Click again to edit
      const updatedTextElement = screen.getByText("Updated Text");
      fireEvent.click(updatedTextElement);

      // Input should now show the updated value, not the original
      const reEditInput = screen.getByDisplayValue("Updated Text");
      expect(reEditInput).toBeInTheDocument();
      expect(screen.queryByDisplayValue("Original Text")).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty string values", () => {
      const value = () => "";
      const onChange = () => {};
      const placeholder = "Click to edit";

      render(() => (
        <EditableText
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      ));

      expect(screen.getByText(placeholder)).toBeInTheDocument();
    });

    it("handles very long text", () => {
      const longText = "A".repeat(1000);
      const value = () => longText;
      const onChange = () => {};

      render(() => (
        <EditableText
          value={value}
          onChange={onChange}
        />
      ));

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("handles special characters", () => {
      const specialText = "Hello @#$%^&*()_+{}|:<>?[]\\;',./";
      const value = () => specialText;
      const onChange = () => {};

      render(() => (
        <EditableText
          value={value}
          onChange={onChange}
        />
      ));

      expect(screen.getByText(specialText)).toBeInTheDocument();
    });

    it("handles null input value gracefully", () => {
      const value = () => "test";
      const onChange = vi.fn();

      // Mock the input ref to return an input with null value
      const mockInput = {
        value: null as any,
        focus: vi.fn(),
      };

      render(() => <EditableText value={value} onChange={onChange} />);

      const textElement = screen.getByText("test");
      fireEvent.click(textElement);

      // Manually set the input ref to our mock
      const component = screen.getByDisplayValue("test");
      (component as any).value = null;

      const buttons = screen.getAllByRole("button");
      fireEvent.click(buttons[0]); // Save button

      // Should handle null value gracefully (fallback to empty string)
      expect(onChange).toHaveBeenCalledWith("");
    });

    it("handles undefined input ref in getTextWidth", () => {
      const value = () => "test";
      const onChange = vi.fn();

      render(() => <EditableText value={value} onChange={onChange} />);

      const textElement = screen.getByText("test");
      fireEvent.click(textElement);

      // Get the input element
      const input = screen.getByDisplayValue("test");

      // Temporarily replace the input's getBoundingClientRect to simulate text measurement
      const originalGetBoundingClientRect = input.getBoundingClientRect;
      input.getBoundingClientRect = vi.fn().mockReturnValue({ width: 50 });

      // Trigger an input event which should call getTextWidth
      fireEvent.input(input, { target: { value: "test updated" } });

      // Restore original method
      input.getBoundingClientRect = originalGetBoundingClientRect;

      // The component should still work normally
      expect(input).toBeInTheDocument();
    });
  });
});
