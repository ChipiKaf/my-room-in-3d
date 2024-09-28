import { useCallback, useRef, useMemo } from 'react';
import * as THREE from 'three'

const useSpherical = () => {
  const value = useRef(new THREE.Spherical(20, Math.PI * 0.35, - Math.PI * 0.25))
  const smoothed = useRef(value.current.clone())
  const smoothing = useMemo(() => 5, [])

  const updateTheta = useCallback((valueToAdd) => {
    value.current.theta -= valueToAdd
  }, [])

  const updatePhi = useCallback((valueToAdd) => {
    value.current.phi -= valueToAdd
  }, [])


  return {
    value,
    smoothed,
    smoothing,
    updateTheta,
    updatePhi
  };
};

export default useSpherical;