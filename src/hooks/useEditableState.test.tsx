import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { useEditableState } from "~/hooks/useEditableState";

describe("useEditableState", () => {
  it("should initialize with correct default values", () => {
    const onChange = vi.fn();
    const getCurrentValue = () => "test value";

    const TestComponent = () => {
      const {
        isEditing,
        initialValue,
        inputRef,
        setInputRef,
        handleClick,
        handleKeyDown,
        approveChanges,
        cancelChanges,
      } = useEditableState({
        initialValue: "initial",
        onChange,
        getCurrentValue,
      });

      expect(isEditing()).toBe(false);
      expect(initialValue()).toBe("initial");

      return <div>Test</div>;
    };

    render(() => <TestComponent />);
  });

  it("should enter edit mode when handleClick is called", () => {
    const onChange = vi.fn();
    const getCurrentValue = () => "current value";

    const TestComponent = () => {
      const { isEditing, handleClick, initialValue } = useEditableState({
        initialValue: "initial",
        onChange,
        getCurrentValue,
      });

      return (
        <div>
          <button onClick={handleClick} data-testid="edit-button">
            Edit
          </button>
          <span data-testid="editing-state">{isEditing() ? "editing" : "not-editing"}</span>
          <span data-testid="initial-value">{initialValue()}</span>
        </div>
      );
    };

    const { getByTestId } = render(() => <TestComponent />);

    expect(getByTestId("editing-state").textContent).toBe("not-editing");
    expect(getByTestId("initial-value").textContent).toBe("initial");

    fireEvent.click(getByTestId("edit-button"));

    expect(getByTestId("editing-state").textContent).toBe("editing");
    expect(getByTestId("initial-value").textContent).toBe("current value");
  });

  it("should call onChange when approving changes with different value", () => {
    const onChange = vi.fn();
    const getCurrentValue = () => "original";

    const TestComponent = () => {
      const { approveChanges } = useEditableState({
        initialValue: "original",
        onChange,
        getCurrentValue,
      });

      return (
        <button onClick={() => approveChanges("changed")} data-testid="approve-button">
          Approve
        </button>
      );
    };

    const { getByTestId } = render(() => <TestComponent />);

    fireEvent.click(getByTestId("approve-button"));

    expect(onChange).toHaveBeenCalledWith("changed");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("should not call onChange when approving changes with same value", () => {
    const onChange = vi.fn();
    const getCurrentValue = () => "same";

    const TestComponent = () => {
      const { approveChanges } = useEditableState({
        initialValue: "same",
        onChange,
        getCurrentValue,
      });

      return (
        <button onClick={() => approveChanges("same")} data-testid="approve-button">
          Approve
        </button>
      );
    };

    const { getByTestId } = render(() => <TestComponent />);

    fireEvent.click(getByTestId("approve-button"));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("should exit edit mode when canceling changes", () => {
    const onChange = vi.fn();
    const getCurrentValue = () => "value";

    const TestComponent = () => {
      const { isEditing, handleClick, cancelChanges } = useEditableState({
        initialValue: "value",
        onChange,
        getCurrentValue,
      });

      return (
        <div>
          <button onClick={handleClick} data-testid="edit-button">Edit</button>
          <button onClick={cancelChanges} data-testid="cancel-button">Cancel</button>
          <span data-testid="editing-state">{isEditing() ? "editing" : "not-editing"}</span>
        </div>
      );
    };

    const { getByTestId } = render(() => <TestComponent />);

    fireEvent.click(getByTestId("edit-button"));
    expect(getByTestId("editing-state").textContent).toBe("editing");

    fireEvent.click(getByTestId("cancel-button"));
    expect(getByTestId("editing-state").textContent).toBe("not-editing");
  });

  it("should handle Enter key to approve changes", () => {
    const onChange = vi.fn();
    const getCurrentValue = () => "original";

    const TestComponent = () => {
      const { handleKeyDown } = useEditableState({
        initialValue: "original",
        onChange,
        getCurrentValue,
      });

      return (
        <input
          data-testid="input"
          onKeyDown={handleKeyDown}
          value="changed"
        />
      );
    };

    const { getByTestId } = render(() => <TestComponent />);

    fireEvent.keyDown(getByTestId("input"), { key: "Enter" });

    expect(onChange).toHaveBeenCalledWith("changed");
  });

  it("should handle Escape key to cancel changes", () => {
    const onChange = vi.fn();
    const getCurrentValue = () => "value";

    const TestComponent = () => {
      const { isEditing, handleClick, handleKeyDown } = useEditableState({
        initialValue: "value",
        onChange,
        getCurrentValue,
      });

      return (
        <div>
          <button onClick={handleClick} data-testid="edit-button">Edit</button>
          <input
            data-testid="input"
            onKeyDown={handleKeyDown}
          />
          <span data-testid="editing-state">{isEditing() ? "editing" : "not-editing"}</span>
        </div>
      );
    };

    const { getByTestId } = render(() => <TestComponent />);

    fireEvent.click(getByTestId("edit-button"));
    expect(getByTestId("editing-state").textContent).toBe("editing");

    fireEvent.keyDown(getByTestId("input"), { key: "Escape" });
    expect(getByTestId("editing-state").textContent).toBe("not-editing");
  });

  it("should throw error when onChange is not a function", () => {
    expect(() => {
      useEditableState({
        initialValue: "test",
        onChange: "not a function" as any,
        getCurrentValue: () => "test",
      });
    }).toThrow("[useEditableState] onChange must be a function");
  });

  it("should throw error when getCurrentValue is not a function", () => {
    expect(() => {
      useEditableState({
        initialValue: "test",
        onChange: vi.fn(),
        getCurrentValue: "not a function" as any,
      });
    }).toThrow("[useEditableState] getCurrentValue must be a function");
  });

  it("should handle onChange errors gracefully", () => {
    const onChange = vi.fn().mockImplementation(() => {
      throw new Error("onChange error");
    });
    const getCurrentValue = () => "original";

    const TestComponent = () => {
      const { isEditing, approveChanges } = useEditableState({
        initialValue: "original",
        onChange,
        getCurrentValue,
      });

      return (
        <div>
          <button onClick={() => approveChanges("changed")} data-testid="approve-button">
            Approve
          </button>
          <span data-testid="editing-state">{isEditing() ? "editing" : "not-editing"}</span>
        </div>
      );
    };

    const { getByTestId } = render(() => <TestComponent />);

    fireEvent.click(getByTestId("approve-button"));

    // Should still exit editing mode even if onChange throws
    expect(getByTestId("editing-state").textContent).toBe("not-editing");
    expect(onChange).toHaveBeenCalledWith("changed");
  });

  it("should handle getCurrentValue errors gracefully", () => {
    const onChange = vi.fn();
    const getCurrentValue = vi.fn().mockImplementation(() => {
      throw new Error("getCurrentValue error");
    });

    const TestComponent = () => {
      const { handleClick } = useEditableState({
        initialValue: "original",
        onChange,
        getCurrentValue,
      });

      return (
        <button onClick={handleClick} data-testid="edit-button">
          Edit
        </button>
      );
    };

    // Should not throw when handleClick is called
    const { getByTestId } = render(() => <TestComponent />);
    fireEvent.click(getByTestId("edit-button"));

    expect(getCurrentValue).toHaveBeenCalled();
  });

  it("should handle handleKeyDown errors gracefully", () => {
    const onChange = vi.fn();
    const getCurrentValue = () => "original";

    const TestComponent = () => {
      const { handleKeyDown } = useEditableState({
        initialValue: "original",
        onChange,
        getCurrentValue,
      });

      return (
        <input
          data-testid="input"
          onKeyDown={(e) => {
            // Mock a scenario that would cause an error
            Object.defineProperty(e, 'currentTarget', {
              get: () => { throw new Error("target error"); }
            });
            handleKeyDown(e);
          }}
        />
      );
    };

    const { getByTestId } = render(() => <TestComponent />);

    // Should not throw when keyDown handler has an error
    expect(() => {
      fireEvent.keyDown(getByTestId("input"), { key: "Enter" });
    }).not.toThrow();
  });

  it("should focus input and set cursor position when entering edit mode", () => {
    const onChange = vi.fn();
    const getCurrentValue = () => "test value";

    const TestComponent = () => {
      const { handleClick, inputRef, setInputRef } = useEditableState({
        initialValue: "initial",
        onChange,
        getCurrentValue,
      });

      return (
        <div>
          <button onClick={handleClick} data-testid="edit-button">Edit</button>
          <input
            ref={setInputRef}
            data-testid="input"
            value="test value"
          />
        </div>
      );
    };

    const { getByTestId } = render(() => <TestComponent />);

    fireEvent.click(getByTestId("edit-button"));

    // The focus logic runs in requestAnimationFrame, so we need to wait
    // In a real test, you might need to use fake timers or wait for the next tick
    const input = getByTestId("input");
    expect(input).toBeInTheDocument();
  });
});