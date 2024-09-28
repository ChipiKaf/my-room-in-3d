import { useThree, extend, useLoader, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { DRACOLoader } from 'three/examples/jsm/Addons.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three'
import useNavigation from './hooks/useNavigation'

extend({ OrbitControls })

export default function Experience()
{
    const { camera, gl, size } = useThree()
    const centerPiece = new THREE.Vector3()
    const view = useNavigation()

    useFrame((state, delta) => {
        const theta = (view.drag.delta.current.x * view.drag.sensitivity || 0) / Math.min(size.width, size.height)
        const phi = (view.drag.delta.current.y * view.drag.sensitivity || 0) / Math.min(size.width, size.height)
        view.spherical.updateTheta(theta)
        view.spherical.updatePhi(phi)
        
        view.drag.delta.current.x = 0
        view.drag.delta.current.y = 0

        
        // smoothing
        view.spherical.smoothed.current.phi = THREE.MathUtils.damp(
            view.spherical.smoothed.current.phi,
            view.spherical.value.current.phi,
            view.spherical.smoothing,
            delta
        )
    
        view.spherical.smoothed.current.theta = THREE.MathUtils.damp(
            view.spherical.smoothed.current.theta,
            view.spherical.value.current.theta,
            view.spherical.smoothing,
            delta
        )
        const viewPosition = new THREE.Vector3()
        viewPosition.setFromSpherical(view.spherical.smoothed.current)
        camera.position.copy(viewPosition)
        camera.lookAt(view.target.current)
    })
    // Load model and baked texture
    const model = useLoader(GLTFLoader, 'models/room4.glb', (loader) => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('./draco/')
        loader.setDRACOLoader(dracoLoader)
    })
    const bakedTexture = useLoader(THREE.TextureLoader, 'textures/newbake13.jpg') // Load baked texture

    useEffect(() => {
        camera.lookAt(centerPiece)
    }, [])

    useEffect(() => {
        // Traverse through the model and apply the baked texture
        bakedTexture.flipY = false
        bakedTexture.colorSpace = THREE.SRGBColorSpace
        model.scene.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshBasicMaterial({
                    map: bakedTexture // Set baked texture to the material
                    // color: 0xff0000
                })
            }
        })
        
    }, [model, bakedTexture])

    return (
        <>
            {/* Apply the model to the scene */}
            <primitive object={model.scene} />
        </>
    )
}
