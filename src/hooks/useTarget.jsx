import { useCallback, useRef, useMemo } from 'react';
import * as THREE from 'three'

const useTarget = () => {
  const value = useRef(new THREE.Vector3(0, 2, 0))
  const smoothed = useRef(value.current.clone())
  const smoothing = useMemo(() => 0.005, [])

  return {
    value,
    smoothed,
    smoothing,
  };
};

export default useTarget;