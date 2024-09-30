import { useCallback, useRef, useMemo } from 'react';
import * as THREE from 'three'

const useTarget = () => {
  const value = useRef(new THREE.Vector3(0, 2, 0))
  const smoothed = useRef(value.current.clone())
  const smoothing = useMemo(() => 5, [])
  const limits = useMemo(() => ({ x: { min: -4, max: 4 },  y: { min: 1, max: 4 }, z: { min: -4, max: 4 }   }))

  return {
    limits,
    value,
    smoothed,
    smoothing,
  };
};

export default useTarget;