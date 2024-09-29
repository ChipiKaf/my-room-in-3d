import { useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three'

const useDrag = () => {
 const delta = useRef({ x: 0, y: 0 })
 const previous = useRef({ x: 0, y: 0 })
 const sensitivity = useMemo(() => {
    return 1
 }, [])

 /**
  * Drag functions
  */

 const down = useCallback((x, y) => {
  previous.current.x = x
  previous.current.y = y
}, [])

const move = useCallback((x, y) => {
  delta.current.x +=  x - previous.current.x 
  delta.current.y +=  y - previous.current.y

  previous.current.x = x
  previous.current.y = y
}, [])

const up = useCallback(() => () => {

}, [])

const getTheta = (size) => {
  return (delta.current.x * sensitivity || 0) / Math.min(size.width, size.height)
}

const getPhi = (size) => {
 return (delta.current.y * sensitivity || 0) / Math.min(size.width, size.height)
}

const resetDelta = () => {
  delta.current.x = 0
  delta.current.y = 0
}

  return {
    delta,
    previous,
    sensitivity,
    down,
    move,
    up,
    getTheta,
    getPhi,
    resetDelta,
  };
};

export default useDrag;