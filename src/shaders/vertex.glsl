// Vertex Shader
uniform float uMinY;
uniform float uMaxY;
uniform float uGreenSize;
varying float vNormalizedY;
varying float vLowerLimit;
varying float vUpperLimit;

uniform vec2 uResolution;
uniform float uTime;

varying vec2 vUv;

void main() {
    // Standard transformations
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // Normalize the Y position between 0.0 and 1.0
    vNormalizedY = (position.y - uMinY) / (uMaxY - uMinY);
    vUpperLimit = clamp(uGreenSize + uTime, 0.0, 1.0);

    vLowerLimit = clamp(0.0 + uTime, 0.0, vUpperLimit - uGreenSize);


    

    vUv = uv;
}
