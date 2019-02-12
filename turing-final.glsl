#include <common>
#include <packing>

const float DELTA=0.01;
varying vec2 vUv;
uniform sampler2D scaleTextures[3];
uniform sampler2D frameTexture;

void main() {
  int minScale;
  vec4 texels[3];
  vec4 minTexel;

  texels[0] = texture2D(scaleTextures[0], vUv);
  texels[1] = texture2D(scaleTextures[1], vUv);
  texels[2] = texture2D(scaleTextures[2], vUv);

  minTexel = texels[0];

  if(texels[0].b < minTexel.b) {
    minTexel = texels[0];
  }
  if(texels[1].b < minTexel.b) {
    minTexel = texels[1];
  }
  if(texels[2].b < minTexel.b) {
    minTexel = texels[2];
  }
  
   gl_FragColor = vec4((minTexel.r > minTexel.g) ? 
    texture2D(frameTexture, vUv).r + (DELTA * 1.0) :
    texture2D(frameTexture, vUv).r - (DELTA * 1.0));
       
}