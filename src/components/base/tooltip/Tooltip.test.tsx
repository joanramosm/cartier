import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@solidjs/testing-library";
import Tooltip from ".";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Tooltip", () => {
  describe("Rendering", () => {
    it("renders children correctly", () => {
      render(() => <Tooltip content="Tooltip text"><button>Click me</button></Tooltip>);

      expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("does not show tooltip initially", () => {
      render(() => <Tooltip content="Tooltip text"><button>Click me</button></Tooltip>);

      const tooltip = screen.getByText("Tooltip text");
      expect(tooltip.className).not.toContain("visible");
    });
  });

  describe("Interactions", () => {
    it("shows tooltip on mouse enter", () => {
      render(() => <Tooltip content="Tooltip text"><button>Click me</button></Tooltip>);

      const container = screen.getByText("Click me").parentElement!;
      const tooltip = screen.getByText("Tooltip text");

      fireEvent.mouseEnter(container);
      expect(tooltip.className).toContain("visible");
    });

    it("hides tooltip on mouse leave", () => {
      render(() => <Tooltip content="Tooltip text"><button>Click me</button></Tooltip>);

      const container = screen.getByText("Click me").parentElement!;
      const tooltip = screen.getByText("Tooltip text");

      fireEvent.mouseEnter(container);
      expect(tooltip.className).toContain("visible");

      fireEvent.mouseLeave(container);
      expect(tooltip.className).not.toContain("visible");
    });
  });

  describe("Positions", () => {
    it("applies top position by default", () => {
      render(() => <Tooltip content="Tooltip text"><button>Click me</button></Tooltip>);

      const container = screen.getByText("Click me").parentElement!;
      fireEvent.mouseEnter(container);

      const tooltip = screen.getByText("Tooltip text");
      expect(tooltip.className).toContain("top");
    });

    it("applies bottom position", () => {
      render(() => <Tooltip content="Tooltip text" position="bottom"><button>Click me</button></Tooltip>);

      const container = screen.getByText("Click me").parentElement!;
      fireEvent.mouseEnter(container);

      const tooltip = screen.getByText("Tooltip text");
      expect(tooltip.className).toContain("bottom");
    });
  });

  describe("Delay", () => {
    it("shows tooltip immediately when delay is 0", () => {
      render(() => <Tooltip content="Tooltip text" delay={0}><button>Click me</button></Tooltip>);

      const container = screen.getByText("Click me").parentElement!;
      const tooltip = screen.getByText("Tooltip text");

      fireEvent.mouseEnter(container);
      expect(tooltip.className).toContain("visible");
    });

    it("shows tooltip after delay", () => {
      vi.useFakeTimers();
      render(() => <Tooltip content="Tooltip text" delay={500}><button>Click me</button></Tooltip>);

      const container = screen.getByText("Click me").parentElement!;
      const tooltip = screen.getByText("Tooltip text");

      fireEvent.mouseEnter(container);
      expect(tooltip.className).not.toContain("visible");

      vi.advanceTimersByTime(500);
      expect(tooltip.className).toContain("visible");

      vi.useRealTimers();
    });
  });
});