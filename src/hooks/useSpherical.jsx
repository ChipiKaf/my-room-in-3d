import { useCallback, useRef, useMemo } from 'react';
import * as THREE from 'three'

const useSpherical = () => {
  const value = useRef(new THREE.Spherical(20, Math.PI * 0.35, - Math.PI * 0.25))
  const smoothed = useRef(value.current.clone())
  const smoothing = useMemo(() => 5, [])
  const limits = useMemo(() => ({ radius: { min: 10, max: 50 },  phi: { min: 0.01, max: Math.PI * 0.5 }, theta: { min: -Math.PI * 0.5, max: 0 } }))
  const delta = useRef(0)
  const updateTheta = useCallback((valueToAdd) => {
    value.current.theta -= valueToAdd
  }, [])

  const updatePhi = useCallback((valueToAdd) => {
    value.current.phi -= valueToAdd
  }, [])

  const zoom = (_delta) => {
    delta.current +=_delta
    console.log(_delta)
  }


  return {
    delta,
    limits,
    value,
    smoothed,
    smoothing,
    updateTheta,
    updatePhi,
    zoom
  };
};

export default useSpherical;