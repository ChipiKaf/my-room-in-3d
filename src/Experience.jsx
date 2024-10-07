import { useThree, extend, useLoader, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { DRACOLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import * as THREE from "three";
import useNavigation from "./hooks/useNavigation";

const PIXEL_RATIO = Math.min(window.devicePixelRatio, 2);

extend({ OrbitControls });

export default function Experience() {
  const { camera, gl, size } = useThree();
  useEffect(() => {
    camera.near = 0.1; // Set near clipping plane closer
    camera.far = 100;  // Reduce the far clipping plane
    camera.updateProjectionMatrix(); // Update the camera's projection matrix
  }, [camera]);
  const centerPiece = new THREE.Vector3();
  const pcStripMaterial = useRef(
    new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uResolution: new THREE.Uniform(
          new THREE.Vector2(size.width * PIXEL_RATIO, size.height * PIXEL_RATIO)
        ),
        uMinY: new THREE.Uniform(0),
        uMaxY: new THREE.Uniform(1),
        uGreenSize: new THREE.Uniform(0.2),

        uTime: new THREE.Uniform(0.0),
      },
      blending: THREE.NormalBlending,
      lights: false,
      depthWrite: true,
      // lights: false, // Disable any lighting calculations
      depthTest: true, // Prevent depth testing to avoid visual artifacts
      transparent: true, // Ensure transparency works as expected if needed
    })
  );
  const view = useNavigation();

  useFrame((state, delta) => {
    pcStripMaterial.current.uniforms.uTime.value += 0.01;
    // zoom
    
    view.spherical.value.current.radius += view.spherical.delta.current * 0.01;
    // Apply limits
    view.spherical.value.current.radius = Math.min(
      Math.max(
        view.spherical.value.current.radius,
        view.spherical.limits.radius.min
      ),
      view.spherical.limits.radius.max
    );

    if (view.canMove.current) {
      const theta = view.drag.getTheta(size);
      const phi = view.drag.getPhi(size);

      view.spherical.updateTheta(theta);
      view.spherical.updatePhi(phi);

      // Apply limits

      view.spherical.value.current.theta = Math.min(
        Math.max(
          view.spherical.value.current.theta,
          view.spherical.limits.theta.min
        ),
        view.spherical.limits.theta.max
      );
      view.spherical.value.current.phi = Math.min(
        Math.max(
          view.spherical.value.current.phi,
          view.spherical.limits.phi.min
        ),
        view.spherical.limits.phi.max
      );
    } else {
      const up = new THREE.Vector3(0, 1, 0);
      const right = new THREE.Vector3(-1, 0, 0);

      up.applyQuaternion(camera.quaternion);
      right.applyQuaternion(camera.quaternion);

      up.multiplyScalar(view.drag.delta.current.y * 0.01);
      right.multiplyScalar(view.drag.delta.current.x * 0.01);

      view.target.value.current.add(up);
      view.target.value.current.add(right);

      // Apply limits

      view.target.value.current.x = Math.min(
        Math.max(view.target.value.current.x, view.target.limits.x.min),
        view.target.limits.x.max
      );
      view.target.value.current.y = Math.min(
        Math.max(view.target.value.current.y, view.target.limits.y.min),
        view.target.limits.y.max
      );
      view.target.value.current.z = Math.min(
        Math.max(view.target.value.current.z, view.target.limits.z.min),
        view.target.limits.z.max
      );
    }

    view.drag.resetDelta();
    view.spherical.delta.current = 0;
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
  const model = useLoader(
    GLTFLoader,
    "models/room-latest-new.glb",
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("./draco/");
      loader.setDRACOLoader(dracoLoader);
    }
  );

  const pcStrip = useLoader(GLTFLoader, "models/pc-strip.glb", (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/");
    loader.setDRACOLoader(dracoLoader);
  });
  const bakedTexture = useLoader(
    THREE.TextureLoader,
    "textures/day-texture-PBR.jpg"
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
        if (child.name === "Cube.024") {
          child.visible = false;
        }
        child.material = new THREE.MeshBasicMaterial({
          map: bakedTexture, // Set baked texture to the material
          // color: 0xff0000
        });
      }
    });
  }, [model, bakedTexture]);

  useEffect(() => {
    pcStrip.scene.position.z += 0.01;
    pcStrip.scene.children.forEach((child) => {
      if (child.isMesh) {
        const geometry = child.geometry;
  
        // Ensure the geometry has a bounding box
        if (!geometry.boundingBox) {
          geometry.computeBoundingBox();
        }
  
        const boundingBox = geometry.boundingBox;
  
        const minY = boundingBox.min.y;
        const maxY = boundingBox.max.y;
  
        // Update the uniform values
        pcStripMaterial.current.uniforms.uMinY.value = minY;
        pcStripMaterial.current.uniforms.uMaxY.value = maxY;
  
        // Assign the ShaderMaterial to the mesh
        child.renderOrder = 1
        child.material = pcStripMaterial.current;
      }
    });
  }, [pcStrip]);

  return (
    <>
      {/* Apply the model to the scene */}
      <primitive object={pcStrip.scene} />
      <primitive object={model.scene} />
    </>
  );
}
