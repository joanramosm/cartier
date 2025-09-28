import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { useDynamicButtonPosition } from "~/hooks/useDynamicButtonPosition";

describe("useDynamicButtonPosition", () => {
  // Mock getComputedStyle for consistent testing
  const originalGetComputedStyle = window.getComputedStyle;
  beforeEach(() => {
    window.getComputedStyle = vi.fn().mockReturnValue({
      fontSize: '16px',
    });
  });

  afterEach(() => {
    window.getComputedStyle = originalGetComputedStyle;
  });

  it("should initialize with buttonX as 0", () => {
    const getTextWidth = () => 100;
    const containerRef = () => ({ offsetWidth: 200 } as HTMLElement);

    const TestComponent = () => {
      const { buttonX } = useDynamicButtonPosition({
        getTextWidth,
        containerRef,
      });

      expect(buttonX()).toBe(0);
      return <div>Test</div>;
    };

    render(() => <TestComponent />);
  });

  it("should calculate position correctly with default values", () => {
    const getTextWidth = () => 100;
    const containerRef = () => ({ offsetWidth: 300 } as HTMLElement);

    const TestComponent = () => {
      const { buttonX, updatePosition } = useDynamicButtonPosition({
        getTextWidth,
        containerRef,
      });

      updatePosition();
      // 100 (text width) + 20 (1.25rem * 16px) = 120
      expect(buttonX()).toBe(120);

      return <div>Test</div>;
    };

    render(() => <TestComponent />);
  });

  it("should respect custom buttonWidthRem and offsetRem", () => {
    const getTextWidth = () => 50;
    const containerRef = () => ({ offsetWidth: 300 } as HTMLElement);

    const TestComponent = () => {
      const { buttonX, updatePosition } = useDynamicButtonPosition({
        getTextWidth,
        containerRef,
        buttonWidthRem: 2,
        offsetRem: 0.5,
      });

      updatePosition();
      // 50 (text width) + 8 (0.5rem * 16px) = 58
      expect(buttonX()).toBe(58);

      return <div>Test</div>;
    };

    render(() => <TestComponent />);
  });

  it("should prevent overflow when buttons would exceed container width", () => {
    const getTextWidth = () => 250;
    const containerRef = () => ({ offsetWidth: 300 } as HTMLElement);

    const TestComponent = () => {
      const { buttonX, updatePosition } = useDynamicButtonPosition({
        getTextWidth,
        containerRef,
        buttonWidthRem: 4, // 64px
        offsetRem: 1.25, // 20px
      });

      updatePosition();
      // 250 + 20 = 270, but 270 + 64 = 334 > 300, so position at 300 - 64 = 236
      expect(buttonX()).toBe(236);

      return <div>Test</div>;
    };

    render(() => <TestComponent />);
  });

  it("should handle negative text width gracefully", () => {
    const getTextWidth = () => -10;
    const containerRef = () => ({ offsetWidth: 300 } as HTMLElement);

    const TestComponent = () => {
      const { buttonX, updatePosition } = useDynamicButtonPosition({
        getTextWidth,
        containerRef,
      });

      updatePosition();
      // -10 (text width) + 20 (1.25rem * 16px) = 10
      expect(buttonX()).toBe(10);

      return <div>Test</div>;
    };

    render(() => <TestComponent />);
  });

  it("should clamp position to 0 when calculation results in negative", () => {
    const getTextWidth = () => -50;
    const containerRef = () => ({ offsetWidth: 300 } as HTMLElement);

    const TestComponent = () => {
      const { buttonX, updatePosition } = useDynamicButtonPosition({
        getTextWidth,
        containerRef,
        offsetRem: 0, // No offset
      });

      updatePosition();
      // -50 + 0 = -50, clamped to 0
      expect(buttonX()).toBe(0);

      return <div>Test</div>;
    };

    render(() => <TestComponent />);
  });

  it("should handle undefined container ref", () => {
    const getTextWidth = () => 100;
    const containerRef = () => undefined;

    const TestComponent = () => {
      const { buttonX, updatePosition } = useDynamicButtonPosition({
        getTextWidth,
        containerRef,
      });

      updatePosition();
      // Should remain 0 since container is undefined
      expect(buttonX()).toBe(0);

      return <div>Test</div>;
    };

    render(() => <TestComponent />);
  });

  it("should handle font size parsing errors gracefully", () => {
    // Mock getComputedStyle to throw an error
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = vi.fn().mockImplementation(() => {
      throw new Error("CSS parsing error");
    });

    const getTextWidth = () => 100;
    const containerRef = () => ({ offsetWidth: 300 } as HTMLElement);

    const TestComponent = () => {
      const { buttonX, updatePosition } = useDynamicButtonPosition({
        getTextWidth,
        containerRef,
      });

      updatePosition();
      // Should use fallback font size of 16px: 100 + 20 = 120
      expect(buttonX()).toBe(120);

      return <div>Test</div>;
    };

    render(() => <TestComponent />);

    // Restore original function
    window.getComputedStyle = originalGetComputedStyle;
  });
});