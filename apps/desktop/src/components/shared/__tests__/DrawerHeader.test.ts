import { render, fireEvent } from "@testing-library/svelte";
import DrawerHeader from "../DrawerHeader.svelte";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("DrawerHeader middle-click handling", () => {
  let originalOnAux: any;

  beforeEach(() => {
    originalOnAux = (window as any).onauxclick;
  });

  afterEach(() => {
    if (originalOnAux !== undefined) {
      (window as any).onauxclick = originalOnAux;
    } else {
      delete (window as any).onauxclick;
    }
  });

  it("calls onclose on auxclick when supported", async () => {
    // Signal environment support for auxclick
    (window as any).onauxclick = () => {};

    const onclose = vi.fn();
    const { container } = render(DrawerHeader, {
      props: { content: () => "Title", onclose },
    });

    const header = container.querySelector(".drawer-header") as HTMLElement;
    header.dispatchEvent(
      new MouseEvent("auxclick", { button: 1, bubbles: true, cancelable: true }),
    );

    expect(onclose).toHaveBeenCalledTimes(1);
  });

  it("calls onclose on mousedown fallback when auxclick unsupported", async () => {
    delete (window as any).onauxclick;

    const onclose = vi.fn();
    const { container } = render(DrawerHeader, {
      props: { content: () => "Title", onclose },
    });

    const header = container.querySelector(".drawer-header") as HTMLElement;
    await fireEvent.mouseDown(header, { button: 1 });

    expect(onclose).toHaveBeenCalledTimes(1);
  });

  it("does not double-invoke on auxclick + mousedown", async () => {
    (window as any).onauxclick = () => {};

    const onclose = vi.fn();
    const { container } = render(DrawerHeader, {
      props: { content: () => "Title", onclose },
    });

    const header = container.querySelector(".drawer-header") as HTMLElement;
    header.dispatchEvent(
      new MouseEvent("auxclick", { button: 1, bubbles: true, cancelable: true }),
    );
    await fireEvent.mouseDown(header, { button: 1 });

    expect(onclose).toHaveBeenCalledTimes(1);
  });
});
