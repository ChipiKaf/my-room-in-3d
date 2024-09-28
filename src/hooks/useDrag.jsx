import { useRef, useMemo } from 'react';
import * as THREE from 'three'

const useDrag = () => {
 const delta = useRef({ x: 0, y: 0 })
 const previous = useRef({ x: 0, y: 0 })
 const sensitivity = useMemo(() => {
    return 1
 }, [])


  return {
    delta,
    previous,
    sensitivity
  };
};

export default useDrag;