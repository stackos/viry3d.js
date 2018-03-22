import Const from './Const'

const vs = `
  attribute vec4 a_Position;
  attribute vec4 a_Normal;
  attribute vec4 a_Tangent;
  attribute vec2 a_UV;

  uniform mat4 u_MVPMatrix;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_NormalMatrix;

  varying vec3 v_Position;
  varying vec2 v_UV;
  varying mat3 v_TBN;

  void main()
  {
    vec4 pos = u_ModelMatrix * a_Position;
    v_Position = vec3(pos.xyz) / pos.w;

    vec3 normalW = normalize(vec3(u_NormalMatrix * vec4(a_Normal.xyz, 0.0)));
    vec3 tangentW = normalize(vec3(u_ModelMatrix * vec4(a_Tangent.xyz, 0.0)));
    vec3 bitangentW = cross(normalW, tangentW) * a_Tangent.w;
    v_TBN = mat3(tangentW, bitangentW, normalW);

    v_UV = a_UV;

    gl_Position = u_MVPMatrix * a_Position; // needs w for proper perspective correction
  }
`

const fs = `
  precision highp float;

  uniform vec3 u_LightDirection;
  uniform vec4 u_LightColor;
  uniform samplerCube u_DiffuseEnvSampler;
  uniform samplerCube u_SpecularEnvSampler;
  uniform sampler2D u_brdfLUT;
  uniform sampler2D u_BaseColorSampler;
  uniform sampler2D u_NormalSampler;
  uniform float u_NormalScale;
  uniform sampler2D u_EmissiveSampler;
  uniform vec3 u_EmissiveFactor;
  uniform sampler2D u_MetallicRoughnessSampler;
  uniform sampler2D u_OcclusionSampler;
  uniform float u_OcclusionStrength;
  uniform vec2 u_MetallicRoughnessValues;
  uniform vec4 u_BaseColorFactor;
  uniform vec3 u_Camera;

  varying vec3 v_Position;
  varying vec2 v_UV;
  varying mat3 v_TBN;

  struct PBRInfo
  {
      float NdotL;                  // cos angle between normal and light direction
      float NdotV;                  // cos angle between normal and view direction
      float NdotH;                  // cos angle between normal and half vector
      float LdotH;                  // cos angle between light direction and half vector
      float VdotH;                  // cos angle between view direction and half vector
      float perceptualRoughness;    // roughness value, as authored by the model creator (input to shader)
      float metalness;              // metallic value at the surface
      vec3 reflectance0;            // full reflectance color (normal incidence angle)
      vec3 reflectance90;           // reflectance color at grazing angle
      float alphaRoughness;         // roughness mapped to a more linear change in the roughness (proposed by [2])
      vec3 diffuseColor;            // color contribution from diffuse lighting
      vec3 specularColor;           // color contribution from specular lighting
  };

  const float M_PI = 3.141592653589793;
  const float c_MinRoughness = 0.04;

  vec4 SRGBtoLINEAR(vec4 srgbIn)
  {
      vec3 linOut = pow(srgbIn.xyz,vec3(2.2));
      return vec4(linOut,srgbIn.w);;
  }

  vec3 getNormal()
  {
      mat3 tbn = v_TBN;
      vec3 n = texture2D(u_NormalSampler, v_UV).rgb;
      n = normalize(tbn * ((2.0 * n - 1.0) * vec3(u_NormalScale, u_NormalScale, 1.0)));
      return n;
  }

  vec3 getIBLContribution(PBRInfo pbrInputs, vec3 n, vec3 reflection)
  {
      float mipCount = 9.0; // resolution of 512x512
      float lod = (pbrInputs.perceptualRoughness * mipCount);
      vec3 brdf = SRGBtoLINEAR(texture2D(u_brdfLUT, vec2(pbrInputs.NdotV, 1.0 - pbrInputs.perceptualRoughness))).rgb;
      vec3 diffuseLight = SRGBtoLINEAR(textureCube(u_DiffuseEnvSampler, n)).rgb;
      vec3 specularLight = SRGBtoLINEAR(textureCube(u_SpecularEnvSampler, reflection)).rgb;
      vec3 diffuse = diffuseLight * pbrInputs.diffuseColor;
      vec3 specular = specularLight * (pbrInputs.specularColor * brdf.x + brdf.y);
      return diffuse + specular;
  }

  vec3 diffuse(PBRInfo pbrInputs)
  {
      return pbrInputs.diffuseColor / M_PI;
  }

  vec3 specularReflection(PBRInfo pbrInputs)
  {
      return pbrInputs.reflectance0 + (pbrInputs.reflectance90 - pbrInputs.reflectance0) * pow(clamp(1.0 - pbrInputs.VdotH, 0.0, 1.0), 5.0);
  }

  float geometricOcclusion(PBRInfo pbrInputs)
  {
      float NdotL = pbrInputs.NdotL;
      float NdotV = pbrInputs.NdotV;
      float r = pbrInputs.alphaRoughness;
      float attenuationL = 2.0 * NdotL / (NdotL + sqrt(r * r + (1.0 - r * r) * (NdotL * NdotL)));
      float attenuationV = 2.0 * NdotV / (NdotV + sqrt(r * r + (1.0 - r * r) * (NdotV * NdotV)));
      return attenuationL * attenuationV;
  }

  float microfacetDistribution(PBRInfo pbrInputs)
  {
      float roughnessSq = pbrInputs.alphaRoughness * pbrInputs.alphaRoughness;
      float f = (pbrInputs.NdotH * roughnessSq - pbrInputs.NdotH) * pbrInputs.NdotH + 1.0;
      return roughnessSq / (M_PI * f * f);
  }

  void main()
  {
      float perceptualRoughness = u_MetallicRoughnessValues.y;
      float metallic = u_MetallicRoughnessValues.x;

      vec4 mrSample = texture2D(u_MetallicRoughnessSampler, v_UV);
      perceptualRoughness = mrSample.g * perceptualRoughness;
      metallic = mrSample.b * metallic;
      perceptualRoughness = clamp(perceptualRoughness, c_MinRoughness, 1.0);
      metallic = clamp(metallic, 0.0, 1.0);
      float alphaRoughness = perceptualRoughness * perceptualRoughness;

      vec4 baseColor = SRGBtoLINEAR(texture2D(u_BaseColorSampler, v_UV)) * u_BaseColorFactor;
      vec3 f0 = vec3(0.04);
      vec3 diffuseColor = baseColor.rgb * (vec3(1.0) - f0);
      diffuseColor *= 1.0 - metallic;
      vec3 specularColor = mix(f0, baseColor.rgb, metallic);
      float reflectance = max(max(specularColor.r, specularColor.g), specularColor.b);
      float reflectance90 = clamp(reflectance * 25.0, 0.0, 1.0);
      vec3 specularEnvironmentR0 = specularColor.rgb;
      vec3 specularEnvironmentR90 = vec3(1.0, 1.0, 1.0) * reflectance90;

      vec3 n = getNormal();                             // normal at surface point
      vec3 v = normalize(u_Camera - v_Position);        // Vector from surface point to camera
      vec3 l = normalize(u_LightDirection);             // Vector from surface point to light
      vec3 h = normalize(l + v);                        // Half vector between both l and v
      vec3 reflection = -normalize(reflect(v, n));

      float NdotL = clamp(dot(n, l), 0.001, 1.0);
      float NdotV = abs(dot(n, v)) + 0.001;
      float NdotH = clamp(dot(n, h), 0.0, 1.0);
      float LdotH = clamp(dot(l, h), 0.0, 1.0);
      float VdotH = clamp(dot(v, h), 0.0, 1.0);

      PBRInfo pbrInputs = PBRInfo(
          NdotL,
          NdotV,
          NdotH,
          LdotH,
          VdotH,
          perceptualRoughness,
          metallic,
          specularEnvironmentR0,
          specularEnvironmentR90,
          alphaRoughness,
          diffuseColor,
          specularColor
      );

      // Calculate the shading terms for the microfacet specular shading model
      vec3 F = specularReflection(pbrInputs);
      float G = geometricOcclusion(pbrInputs);
      float D = microfacetDistribution(pbrInputs);

      // Calculation of analytical lighting contribution
      vec3 diffuseContrib = (1.0 - F) * diffuse(pbrInputs);
      vec3 specContrib = F * G * D / (4.0 * NdotL * NdotV);

      // Obtain final intensity as reflectance (BRDF) scaled by the energy of the light (cosine law)
      vec3 color = NdotL * u_LightColor.rgb * (diffuseContrib + specContrib);



      //gl_FragColor = vec4(perceptualRoughness, metallic, 1, 1);
      //gl_FragColor = baseColor;
      //gl_FragColor = vec4(n, 1);
      gl_FragColor = vec4(color, 1);



/*
      // Calculate lighting contribution from image based lighting source (IBL)
      color += getIBLContribution(pbrInputs, n, reflection);

      // Apply optional PBR terms for additional (optional) shading
      float ao = texture2D(u_OcclusionSampler, v_UV).r;
      color = mix(color, color * ao, u_OcclusionStrength);

      vec3 emissive = SRGBtoLINEAR(texture2D(u_EmissiveSampler, v_UV)).rgb * u_EmissiveFactor;
      color += emissive;

      gl_FragColor = vec4(pow(color,vec3(1.0/2.2)), baseColor.a);
*/
  }
`

const rs = {
    Cull: Const.Back,
    ZTest: Const.LEqual,
    ZWrite: Const.On,
    Blend: Const.Off,
    SrcBlendMode: Const.SrcAlpha,
    DstBlendMode: Const.OneMinusSrcAlpha,
    Queue: Const.Geometry,
}

export default [
  {
    vs: vs,
    fs: fs,
    rs: rs,
  }
]
