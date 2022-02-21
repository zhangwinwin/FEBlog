#ifdef GL_ES
precision mediump float;
#endif
varying vec3 Normal;
varying vec3 FragPos;
varying vec2 TexCoords;

uniform sampler2D floorTexture;
uniform bool blinn;
uniform vec3 lightPos;
uniform vec3 viewPos;

void main () {
    vec3 color = texture2D(floorTexture, TexCoords).rgb;
    vec3 ambient = 0.05 * color;

    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(lightPos - FragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * color;

    float spec = 0.0;
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);
    if (blinn) {
        vec3 halfwayDir = normalize(lightDir + viewDir);
        spec = pow(max(dot(norm, halfwayDir), 0.0), 32.0);
    } else {
        vec3 reflectDir = reflect(-lightDir, norm);
        spec = pow(max(dot(viewDir, reflectDir), 0.0), 8.0);
    }

    vec3 specular = vec3(0.3) * spec;
    gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}