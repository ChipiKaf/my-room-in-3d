import { useEffect, useRef } from 'react';
import * as THREE from 'three'
import useSpherical from './useSpherical';
import useDrag from './useDrag';

const useNavigation = () => {
  const spherical = useSpherical()
  const drag = useDrag()
  const target = useRef(new THREE.Vector3(0, 2, 0))

  const down = (x, y) => {
    drag.previous.current.x = x
    drag.previous.current.y = y
  }

  const move = (x, y) => {
    drag.delta.current.x +=  x - drag.previous.current.x 
    drag.delta.current.y +=  y - drag.previous.current.y

    drag.previous.current.x = x
    drag.previous.current.y = y
  }

  const up = () => {

  }
  /**
   * Mouse events
   */
  const onMouseMove = (event) => {
    move(event.clientX, event.clientY)
  }
  const onMouseUp = (event) => {
    window.removeEventListener('mouseup', onMouseUp)
    window.removeEventListener('mousemove', onMouseMove)
  }
  const onMouseDown = (event) => {
    down(event.clientX, event.clientY)

    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onMouseMove)
  }

  /**
   * For Mobile
   */
  const onTouchMove = (event) => {
    move(event.touches[0].clientX, event.touches[0].clientY)
  }
  const onTouchEnd = (event) => {
    window.removeEventListener('touchend', onTouchEnd)
    window.removeEventListener('touchmove', onTouchMove)
  }
  const onTouchStart = (event) => {
    down(event.touches[0].clientX, event.touches[0].clientY)

    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('touchmove', onTouchMove)
  }

  useEffect(() => {
    const onContextMenu = (e) => e.preventDefault()
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('touchstart', onTouchStart)
    window.addEventListener('contextmenu', onContextMenu)    
    return () => {
        window.removeEventListener('mousedown', onMouseDown)
        window.removeEventListener('contextmenu', onContextMenu)
        window.removeEventListener('touchstart', onTouchStart)
    }
  }, [])
  return {
    drag,
    spherical,
    target,
  };
};

export default useNavigation;