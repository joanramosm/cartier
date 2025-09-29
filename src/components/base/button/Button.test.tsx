import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@solidjs/testing-library";
import Button from ".";

afterEach(() => {
  cleanup();
});

describe("Button", () => {
  describe("Rendering", () => {
    it("renders children correctly", () => {
      render(() => <Button>Click me</Button>);

      expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("renders with default props", () => {
      render(() => <Button>Test</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("type", "button");
      expect(button).not.toBeDisabled();
    });
  });

  describe("Variants", () => {
    it("applies primary variant by default", () => {
      render(() => <Button>Primary</Button>);

      const button = screen.getByRole("button");
      expect(button.className).toContain("primary");
    });

    it("applies secondary variant", () => {
      render(() => <Button variant="secondary">Secondary</Button>);

      const button = screen.getByRole("button");
      expect(button.className).toContain("secondary");
    });

    it("applies icon variant", () => {
      render(() => <Button variant="icon">Icon</Button>);

      const button = screen.getByRole("button");
      expect(button.className).toContain("icon");
    });
  });

  describe("Sizes", () => {
    it("applies medium size by default", () => {
      render(() => <Button>Medium</Button>);

      const button = screen.getByRole("button");
      expect(button.className).toContain("medium");
    });

    it("applies small size", () => {
      render(() => <Button size="small">Small</Button>);

      const button = screen.getByRole("button");
      expect(button.className).toContain("small");
    });

    it("applies extraSmall size", () => {
      render(() => <Button size="extraSmall">Extra Small</Button>);

      const button = screen.getByRole("button");
      expect(button.className).toContain("extraSmall");
    });

    it("applies large size", () => {
      render(() => <Button size="large">Large</Button>);

      const button = screen.getByRole("button");
      expect(button.className).toContain("large");
    });
  });

  describe("Interactions", () => {
    it("calls onClick when clicked", () => {
      const handleClick = vi.fn();
      render(() => <Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", () => {
      const handleClick = vi.fn();
      render(() => <Button onClick={handleClick} disabled>Disabled</Button>);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("is disabled when disabled prop is true", () => {
      render(() => <Button disabled>Disabled</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("can receive focus", () => {
      render(() => <Button>Focusable</Button>);

      const button = screen.getByRole("button");

      // Focus the button
      button.focus();
      expect(button).toHaveFocus();
    });
  });

  describe("Additional Props", () => {
    it("applies custom class", () => {
      render(() => <Button class="custom-class">Custom Class</Button>);

      const button = screen.getByRole("button");
      expect(button.className).toContain("custom-class");
    });

    it("passes through aria-label", () => {
      render(() => <Button aria-label="Test label">Aria Label</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Test label");
    });

    it("passes through other props", () => {
      render(() => <Button data-testid="custom-button">Other Props</Button>);

      const button = screen.getByTestId("custom-button");
      expect(button).toBeInTheDocument();
    });
  });
});
