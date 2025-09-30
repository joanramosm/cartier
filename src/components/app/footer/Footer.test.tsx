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

      expect(screen.getByText("Cool images")).toBeInTheDocument();
    });

    it("renders the handle with caret down icon initially", () => {
      render(() => <Footer />);

      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe("Interactions", () => {
    it("toggles collapsed state when handle is clicked", () => {
      render(() => <Footer />);

      const buttons = screen.getAllByRole("button");
      const handle = buttons[0]; // Assuming handle is first
      const gallery = screen.getByText("Cool images");
      const content = gallery.parentElement!;

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