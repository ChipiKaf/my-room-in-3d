varying float vNormalizedY;
varying float vUpperLimit;
varying float vLowerLimit;
uniform float uTime;
varying vec2 vUv;

void main() {
    // Define colors
    vec3 orange = vec3(1.0, 0.149, 0.0);
    vec3 green = vec3(0.0, 0.677, 0.017);

    // Determine if the fragment is within the green area
    float isGreen = vNormalizedY < vUpperLimit && vNormalizedY > vLowerLimit ? 0.7 : 0.0;

    // Calculate the blend factor for fade-in (uTime from 0.0 to 0.4)
    float fadeInFactor = clamp(uTime / 0.2, 0.0, 1.0); // Range from 0.0 to 1.0 as uTime goes from 0.0 to 0.4

    // Calculate the blend factor for fade-out (uTime from 1.0 to 2.0)
    float fadeOutFactor = clamp((uTime - 0.8), 0.0, 1.0); // Range from 0.0 to 1.0 as uTime goes from 1.0 to 2.0

    // Interpolate between fully orange and fully green during fade-in
    vec3 fadeInColor = mix(orange, green, fadeInFactor);

    // Interpolate between fully green and fully orange during fade-out
    vec3 fadeOutColor = mix(green, orange, fadeOutFactor);

    // Choose which color to use based on uTime and the fragment being in the green area
    vec3 color;
    if (uTime < 0.4) {
        color = green; // Apply fade-in
    } else if (uTime >= 1.0) {
        color = fadeOutColor; // Apply fade-out
    } else {
        color = green; // Fully green between uTime 0.4 and 1.0
    }

    // Apply the color only if the fragment is within the green area, else it's orange
    vec3 finalColor = mix(orange, color, isGreen);

    gl_FragColor = vec4(finalColor, 1.0);

    // Include Three.js tonemapping and colorspace conversion
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
