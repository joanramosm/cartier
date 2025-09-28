import { describe, it, expect, vi } from "vitest";
import { render } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { useClickOutside } from "~/hooks/useClickOutside";

describe("useClickOutside", () => {
  it("should call onClickOutside when clicking outside the container", async () => {
    const onClickOutside = vi.fn();
    const [isActive] = createSignal(true);

    const TestComponent = () => {
      const { setContainerRef } = useClickOutside({
        isActive,
        onClickOutside,
      });

      return <div ref={setContainerRef} data-testid="container">Content</div>;
    };

    const { getByTestId } = render(() => <TestComponent />);

    // Simulate click outside the container
    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);
    outsideElement.click();
    document.body.removeChild(outsideElement);

    expect(onClickOutside).toHaveBeenCalledTimes(1);
  });

  it("should not call onClickOutside when clicking inside the container", () => {
    const onClickOutside = vi.fn();
    const [isActive] = createSignal(true);

    const TestComponent = () => {
      const { setContainerRef } = useClickOutside({
        isActive,
        onClickOutside,
      });

      return (
        <div ref={setContainerRef} data-testid="container">
          <button data-testid="inside-button">Inside</button>
        </div>
      );
    };

    const { getByTestId } = render(() => <TestComponent />);

    // Click inside the container
    getByTestId("inside-button").click();

    expect(onClickOutside).not.toHaveBeenCalled();
  });

  it("should not add event listeners when not active", () => {
    const onClickOutside = vi.fn();
    const [isActive] = createSignal(false);

    const TestComponent = () => {
      const { setContainerRef } = useClickOutside({
        isActive,
        onClickOutside,
      });

      return <div ref={setContainerRef} data-testid="container">Content</div>;
    };

    render(() => <TestComponent />);

    // Simulate click outside
    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);
    outsideElement.click();
    document.body.removeChild(outsideElement);

    expect(onClickOutside).not.toHaveBeenCalled();
  });

  it("should handle Shadow DOM elements", () => {
    const onClickOutside = vi.fn();
    const [isActive] = createSignal(true);

    const TestComponent = () => {
      const { setContainerRef } = useClickOutside({
        isActive,
        onClickOutside,
      });

      return <div ref={setContainerRef} data-testid="container">Content</div>;
    };

    const { getByTestId } = render(() => <TestComponent />);
    const container = getByTestId("container");

    // Mock Shadow DOM
    Object.defineProperty(container, 'shadowRoot', {
      value: {
        contains: vi.fn().mockReturnValue(false)
      },
      writable: true
    });

    // Simulate click outside
    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);
    outsideElement.click();
    document.body.removeChild(outsideElement);

    expect(onClickOutside).toHaveBeenCalledTimes(1);
  });
});