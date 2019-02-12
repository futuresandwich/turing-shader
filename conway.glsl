#include <common>
#include <packing>

varying vec2 vUv;
uniform float screenWidth;
uniform float screenHeight;
uniform sampler2D frameTexture;
uniform float time;
float sx;
float sy;

float clampS(float val) {
  return val >= 0.5 ? 1.0 : 0.0;
}

vec2 wrap(vec2 coords) {
  vec2 res;
  res = vec2(coords);
  if(res.x < 0.0) {
    res.x += 1.0;
  } else if(res.x > 1.0) {
    res.x -= 1.0;
  }
  if(res.y < 0.0) {
    res.y += 1.0;
  } else if(res.y > 1.0) {
    res.y -= 1.0;
  }
  return res;
}

float conway(vec4 n, vec4 ne, vec4 e, vec4 se, vec4 s, vec4 sw, vec4 w, vec4 nw, vec4 cell) {
  vec4 sum;
  sum = n
    + s
    + e
    + w
    + ne
    + nw
    + se
    + sw;
  
  float score;
  score = sum.r;
  if(clampS(cell.r) == 1.0) { // alive
    if(score < 2.0 || score > 3.0) {
      return 0.0;
    } else {
      return 1.0;
    }
  } else { //dead
  if(score == 3.0 ) {
      return 1.0;
    } else {
      return 0.0;
    }
  }
}

void main() {
  sx = 1.0/(screenWidth + 500.0);
  sy = 1.0/screenHeight;
  gl_FragColor = vec4(
    conway(
      texture2D( frameTexture, wrap(vUv + vec2(0.0, -sy)) ),
      texture2D( frameTexture, wrap(vUv + vec2(sx, -sy)) ),
      texture2D( frameTexture, wrap(vUv + vec2(sx, 0.0)) ),
      texture2D( frameTexture, wrap(vUv + vec2(sx, sy)) ),
      texture2D( frameTexture, wrap(vUv + vec2(0.0, sy)) ),
      texture2D( frameTexture, wrap(vUv + vec2(-sx, sy)) ),
      texture2D( frameTexture, wrap(vUv + vec2(-sx, 0.0)) ),
      texture2D( frameTexture, wrap(vUv + vec2(-sx, -sy)) ),
      texture2D( frameTexture, vUv )
      )
  ) * vec4(1.0, 0.4, 1.0, 1.0);
}