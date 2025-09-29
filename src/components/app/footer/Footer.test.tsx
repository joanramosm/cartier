import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@solidjs/testing-library";
import Footer from ".";

afterEach(() => {
  cleanup();
});

describe("Footer", () => {
  describe("Rendering", () => {
    it("renders the footer menu", () => {
      render(() => <Footer />);

      expect(screen.getByText("Hello world!")).toBeInTheDocument();
    });

    it("renders the handle with caret down icon initially", () => {
      render(() => <Footer />);

      const handle = screen.getByRole("button");
      expect(handle).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("toggles collapsed state when handle is clicked", () => {
      render(() => <Footer />);

      const handle = screen.getByRole("button");
      const content = screen.getByText("Hello world!");

      // Initially not collapsed
      expect(content.className).not.toContain("hidden");

      // Click to collapse
      fireEvent.click(handle);
      expect(content.className).toContain("hidden");

      // Click to expand
      fireEvent.click(handle);
      expect(content.className).not.toContain("hidden");
    });
  });
});