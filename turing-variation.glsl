#include <common>
#include <packing>

varying vec2 vUv;
uniform float screenWidth;
uniform float screenHeight;
uniform sampler2D frameTexture;
uniform float time;
float sx;
float sy;

vec2 wrap(vec2 coords) {
  vec2 res;
  res = vec2(coords);
  if(res.x < 0.00) {
    res.x += 1.0;
  } else if(res.x > 1.0) {
    res.x -= 1.0;
  }
  if(res.y < 0.00) {
    res.y += 1.0;
  } else if(res.y > 1.0) {
    res.y -= 1.0;
  }
  return res;
}

float length(vec2 a, vec2 b) {
  return sqrt((a.x - b.x)*(a.x - b.x) + (a.y - b.y)*(a.y - b.y));
}

float sumDiffCircle2(vec2 center) {
  float sum;
  vec4 tex;
  sum = 0.0;
  for(float i = -2.0; i < 2.0; i += 1.0) {
    for(float j = -2.0; j < 2.0; j += 1.0) {
      //this isn't exactly the same thing
      if(length(vec2(i,j),vec2(0.0,0.0)) <= 2.0) {
        tex = texture2D(frameTexture, wrap(vec2(i*sx,j*sy)));
        sum += abs(tex.r - tex.g);
      }
    }
  }
  return sum;
}

void main() {
  vec4 tex;
  sx = 1.0/screenWidth;
  sy = 1.0/screenHeight;
  
  tex = texture2D(frameTexture, vUv);
  gl_FragColor = vec4(
    tex.r,
    tex.g, //inhibitor
    sumDiffCircle2(vUv),
    0.0
  );
}