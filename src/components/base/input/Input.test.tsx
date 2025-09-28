import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@solidjs/testing-library";
import Input from ".";

afterEach(() => {
  cleanup();
});

describe("Input", () => {
  describe("Rendering", () => {
    it("renders with default props", () => {
      render(() => <Input />);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "text");
      expect(input).not.toBeDisabled();
    });

    it("renders with placeholder", () => {
      render(() => <Input placeholder="Enter text..." />);

      const input = screen.getByPlaceholderText("Enter text...");
      expect(input).toBeInTheDocument();
    });

    it("renders with value", () => {
      render(() => <Input value="Hello World" />);

      const input = screen.getByDisplayValue("Hello World");
      expect(input).toBeInTheDocument();
    });
  });

  describe("Types", () => {
    it("renders text type by default", () => {
      render(() => <Input />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "text");
    });

    it("renders password type", () => {
      render(() => <Input type="password" />);

      const input = document.querySelector('input[type="password"]') as HTMLInputElement;
      expect(input).toHaveAttribute("type", "password");
    });

    it("renders email type", () => {
      render(() => <Input type="email" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "email");
    });
  });

  describe("Sizes", () => {
    it("applies medium size by default", () => {
      render(() => <Input />);

      const input = screen.getByRole("textbox");
      expect(input.className).toContain("medium");
    });

    it("applies small size", () => {
      render(() => <Input size="small" />);

      const input = screen.getByRole("textbox");
      expect(input.className).toContain("small");
    });

    it("applies large size", () => {
      render(() => <Input size="large" />);

      const input = screen.getByRole("textbox");
      expect(input.className).toContain("large");
    });
  });

  describe("Variants", () => {
    it("applies default variant by default", () => {
      render(() => <Input />);

      const input = screen.getByRole("textbox");
      expect(input.className).toContain("default");
    });

    it("applies clean variant", () => {
      render(() => <Input variant="clean" />);

      const input = screen.getByRole("textbox");
      expect(input.className).toContain("clean");
    });
  });

  describe("Interactions", () => {
    it("calls onInput when typing", () => {
      const handleInput = vi.fn();
      render(() => <Input onInput={handleInput} />);

      const input = screen.getByRole("textbox");
      fireEvent.input(input, { target: { value: "Hello" } });

      expect(handleInput).toHaveBeenCalledWith("Hello");
    });

    it("calls onChange when value changes", () => {
      const handleChange = vi.fn();
      render(() => <Input onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "Hello" } });

      expect(handleChange).toHaveBeenCalledWith("Hello");
    });

    it("calls onInputEvent when provided", () => {
      const handleInputEvent = vi.fn();
      render(() => <Input onInputEvent={handleInputEvent} />);

      const input = screen.getByRole("textbox");
      fireEvent.input(input, { target: { value: "Hello" } });

      expect(handleInputEvent).toHaveBeenCalledTimes(1);
      expect(handleInputEvent).toHaveBeenCalledWith(expect.any(Event));
    });

    it("is disabled when disabled prop is true", () => {
      render(() => <Input disabled />);

      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
    });
  });

  describe("Ref handling", () => {
    it("calls ref function when provided", () => {
      const refFn = vi.fn();
      render(() => <Input ref={refFn} />);

      expect(refFn).toHaveBeenCalledTimes(1);
      expect(refFn).toHaveBeenCalledWith(expect.any(HTMLInputElement), undefined);
    });
  });
});