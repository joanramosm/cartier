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

  describe("Keyboard Accessibility", () => {
    it("calls onClick when Enter key is pressed", () => {
      const handleClick = vi.fn();
      render(() => <Button onClick={handleClick}>Enter Test</Button>);

      const button = screen.getByRole("button");
      fireEvent.keyDown(button, { key: "Enter" });

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("calls onClick when Space key is pressed", () => {
      const handleClick = vi.fn();
      render(() => <Button onClick={handleClick}>Space Test</Button>);

      const button = screen.getByRole("button");
      fireEvent.keyDown(button, { key: " " });

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when other keys are pressed", () => {
      const handleClick = vi.fn();
      render(() => <Button onClick={handleClick}>Other Key Test</Button>);

      const button = screen.getByRole("button");
      fireEvent.keyDown(button, { key: "a" });

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("does not call onClick when disabled and Enter is pressed", () => {
      const handleClick = vi.fn();
      render(() => <Button onClick={handleClick} disabled>Disabled Enter</Button>);

      const button = screen.getByRole("button");
      fireEvent.keyDown(button, { key: "Enter" });

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("Loading State", () => {
    it("shows loading spinner when loading is true", () => {
      render(() => <Button loading>Loading Button</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button.textContent).toContain("⟳");
    });

    it("applies loading class when loading", () => {
      render(() => <Button loading>Loading</Button>);

      const button = screen.getByRole("button");
      expect(button.className).toContain("loading");
    });

    it("does not call onClick when loading", () => {
      const handleClick = vi.fn();
      render(() => <Button onClick={handleClick} loading>Loading</Button>);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
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