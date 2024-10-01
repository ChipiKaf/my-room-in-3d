import { useThree, extend, useLoader, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { DRACOLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import useNavigation from "./hooks/useNavigation";

extend({ OrbitControls });

export default function Experience() {
  const { camera, gl, size } = useThree();
  const centerPiece = new THREE.Vector3();
  const view = useNavigation();

  useFrame((state, delta) => {
    // zoom
    view.spherical.value.current.radius += view.spherical.delta.current * 0.01
    // Apply limits
    view.spherical.value.current.radius = Math.min(Math.max(view.spherical.value.current.radius, view.spherical.limits.radius.min), view.spherical.limits.radius.max)
      
    if (view.canMove.current) {
      const theta = view.drag.getTheta(size);
      const phi = view.drag.getPhi(size);

      view.spherical.updateTheta(theta);
      view.spherical.updatePhi(phi);

      // Apply limits

      view.spherical.value.current.theta = Math.min(Math.max(view.spherical.value.current.theta, view.spherical.limits.theta.min), view.spherical.limits.theta.max)
      view.spherical.value.current.phi = Math.min(Math.max(view.spherical.value.current.phi, view.spherical.limits.phi.min), view.spherical.limits.phi.max)


    } else {
      const up = new THREE.Vector3(0, 1, 0)
      const right = new THREE.Vector3(-1, 0, 0)

      up.applyQuaternion(camera.quaternion)
      right.applyQuaternion(camera.quaternion)

      up.multiplyScalar(view.drag.delta.current.y * 0.01)
      right.multiplyScalar(view.drag.delta.current.x * 0.01)

      view.target.value.current.add(up)
      view.target.value.current.add(right)

      // Apply limits

      view.target.value.current.x = Math.min(Math.max(view.target.value.current.x, view.target.limits.x.min), view.target.limits.x.max)
      view.target.value.current.y = Math.min(Math.max(view.target.value.current.y, view.target.limits.y.min), view.target.limits.y.max)
      view.target.value.current.z = Math.min(Math.max(view.target.value.current.z, view.target.limits.z.min), view.target.limits.z.max)

    }

    view.drag.resetDelta();
    view.spherical.delta.current = 0
    // smoothing

    view.target.smoothed.current.x = THREE.MathUtils.damp(
      view.target.smoothed.current.x,
      view.target.value.current.x,
      view.target.smoothing,
      delta
    );

    view.target.smoothed.current.y = THREE.MathUtils.damp(
      view.target.smoothed.current.y,
      view.target.value.current.y,
      view.target.smoothing,
      delta
    );

    view.target.smoothed.current.z = THREE.MathUtils.damp(
      view.target.smoothed.current.z,
      view.target.value.current.z,
      view.target.smoothing,
      delta
    );

    view.spherical.smoothed.current.radius = THREE.MathUtils.damp(
      view.spherical.smoothed.current.radius,
      view.spherical.value.current.radius,
      view.spherical.smoothing,
      delta
    );

    view.spherical.smoothed.current.phi = THREE.MathUtils.damp(
      view.spherical.smoothed.current.phi,
      view.spherical.value.current.phi,
      view.spherical.smoothing,
      delta
    );

    view.spherical.smoothed.current.theta = THREE.MathUtils.damp(
      view.spherical.smoothed.current.theta,
      view.spherical.value.current.theta,
      view.spherical.smoothing,
      delta
    );
    const viewPosition = new THREE.Vector3();
    viewPosition.setFromSpherical(view.spherical.smoothed.current);
    viewPosition.add(view.target.smoothed.current);
    camera.position.copy(viewPosition);
    camera.lookAt(view.target.smoothed.current);
  });
  // Load model and baked texture
  const model = useLoader(GLTFLoader, "models/room-latest.glb", (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/");
    loader.setDRACOLoader(dracoLoader);
  });
  const bakedTexture = useLoader(
    THREE.TextureLoader,
    "textures/day-texture.jpg"
  ); // Load baked texture

  useEffect(() => {
    camera.lookAt(centerPiece);
  }, []);

  useEffect(() => {
    // Traverse through the model and apply the baked texture
    bakedTexture.flipY = false;
    bakedTexture.colorSpace = THREE.SRGBColorSpace;
    model.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshBasicMaterial({
          map: bakedTexture, // Set baked texture to the material
          // color: 0xff0000
        });
      }
    });
  }, [model, bakedTexture]);

  return (
    <>
      {/* Apply the model to the scene */}
      <primitive object={model.scene} />
    </>
  );
}
