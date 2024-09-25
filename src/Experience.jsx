import { useThree, extend, useLoader } from '@react-three/fiber'
import { useEffect } from 'react'
import { DRACOLoader } from 'three/examples/jsm/Addons.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { TextureLoader, MeshBasicMaterial, SRGBColorSpace } from 'three'

extend({ OrbitControls })

export default function Experience()
{
    const { camera, gl } = useThree()
    
    // Load model and baked texture
    const model = useLoader(GLTFLoader, 'models/room4.glb', (loader) => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('./draco/')
        loader.setDRACOLoader(dracoLoader)
    })
    const bakedTexture = useLoader(TextureLoader, 'textures/newbake5.jpg') // Load baked texture

    useEffect(() => {
        // Traverse through the model and apply the baked texture
        bakedTexture.flipY = false
        bakedTexture.colorSpace = SRGBColorSpace
        // bakedTexture.encoding = THREE.sRGBEncoding
        console.log(bakedTexture)
        model.scene.traverse((child) => {
            if (child.isMesh) {
                child.material = new MeshBasicMaterial({
                    map: bakedTexture // Set baked texture to the material
                    // color: 0xff0000
                })
            }
        })

        console.log(model)
        
    }, [model, bakedTexture])

    return (
        <>
            <orbitControls args={[camera, gl.domElement]} />

            {/* <directionalLight position={[5, 5, 5]} color={"#ffffff"} intensity={3} /> */}

            {/* Apply the model to the scene */}
            <primitive object={model.scene} />
        </>
    )
}
