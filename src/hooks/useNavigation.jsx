import { useEffect, useRef } from "react";
import * as THREE from "three";
import useSpherical from "./useSpherical";
import useDrag from "./useDrag";
import normalizeWheel from "normalize-wheel";
import useTarget from "./useTarget";

const useNavigation = () => {
  const spherical = useSpherical();
  const drag = useDrag();
  const target = useTarget();
  const canMove = useRef(false)

  /**
   * Mouse events
   */
  const onMouseMove = (event) => {
      drag.move(event.clientX, event.clientY);
  };
  const onMouseUp = (event) => {
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("mousemove", onMouseMove);
  };
  const onMouseDown = (event) => {
    console.log(event);
    canMove.current = !event.button
    drag.down(event.clientX, event.clientY);

    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
  };

  const onWheel = (event) => {
    console.log("Wheel");
    const normalized = normalizeWheel(event);
    spherical.zoom(normalized.pixelY);
    event.preventDefault();
  };

  /**
   * For Mobile
   */
  const onTouchMove = (event) => {
    drag.move(event.touches[0].clientX, event.touches[0].clientY);
  };
  const onTouchEnd = (event) => {
    window.removeEventListener("touchend", onTouchEnd);
    window.removeEventListener("touchmove", onTouchMove);
  };
  const onTouchStart = (event) => {
    drag.down(event.touches[0].clientX, event.touches[0].clientY);

    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchmove", onTouchMove);
  };

  useEffect(() => {
    const onContextMenu = (e) => e.preventDefault();
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("wheel", onWheel);
    };
  }, []);
  return {
    drag,
    spherical,
    target,
    canMove
  };
};

export default useNavigation;
