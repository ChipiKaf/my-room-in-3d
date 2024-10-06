varying float vNormalizedY;
uniform float uTime;
varying vec2 vUv;

void main() {
    // Define colors
    vec3 orange = vec3(1.0, 0.149, 0.0);
    vec3 green = vec3(0.0, 0.677, 0.017);

    // Make uTime continuous using modulo to loop within 0 to 2
    float loopTime = mod(uTime, 2.0);

    // Create a smooth blend factor
    float blendFactor = smoothstep(0.0, 1.0, abs(vNormalizedY - loopTime));
    float blendFactor2 = smoothstep(0.0, 1.0, abs((vNormalizedY + 1.0) - loopTime));

    // Determine the base color
    vec3 baseColor;
    if (vNormalizedY < loopTime && loopTime < 1.0) {
        baseColor = mix(orange, green, blendFactor);
    } else if (vNormalizedY > loopTime && loopTime < 1.0) {
        baseColor = mix(orange, green, 1.0 - blendFactor);
    }
    else if (loopTime >= 1.0 && vNormalizedY > loopTime - 1.0) {
        baseColor = mix(orange, green, 1.0 - blendFactor2);
    }
    else if (loopTime >= 1.0 && vNormalizedY < loopTime - 1.0) {
        baseColor = mix(orange, green, blendFactor2);
    }

    gl_FragColor = vec4(baseColor, 1.0);

    // Include Three.js tonemapping and colorspace conversion
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}