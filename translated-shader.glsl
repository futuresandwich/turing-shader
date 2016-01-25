#extension GL_OES_standard_derivatives : enable
#ifdef GL_ES
precision mediump float;
#endif
 
const int NUM_SCALES = 3;
const int ACT_RADIUS = 0, INH_RADIUS = 1, EFT = 2, WGT = 3;
const float variationRadius = 3.0;


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
uniform vec4 scales[NUM_SCALES]; //act, inh, eft, wgt, sym
uniform float activators[NUM_SCALES];
uniform float inhibitors[NUM_SCALES];
uniform float variations[NUM_SCALES];

const float SCALES_0_ACT_RADIUS = 100.;
const float SCALES_0_INH_RADIUS = 200.;
const float SCALES_0_EFT = 0.05;
const float SCALES_0_WGT = 1.;
const float SCALES_1_ACT_RADIUS = 10.;
const float SCALES_1_INH_RADIUS = 20.;
const float SCALES_1_EFT = 0.03;
const float SCALES_1_WGT = 1.;
const float SCALES_2_ACT_RADIUS = 1.;
const float SCALES_2_INH_RADIUS = 2.;
const float SCALES_2_EFT = 0.01;
const float SCALES_2_WGT = 1.;

vec2 wrap(vec2 point)
{
	if(point.x > resolution.x)
		point.x = 0;
	if(point.y > resolution.y)
		point.y = 0;
	if(point.x < 0)
		point.x = resolution.x;
	if(point.y < 0)
		point.y = resolution.y;
	return point;
}

vec4 get(vec2 point)
{
	vec2 wrappedPoint = wrap(point,dimensions);
	return texture2D(backbuffer,wrappedPoint);
}

void noise()
{
	return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float normalize(float val)
{
	return color;
}

void getAverage(float[] items, int length)
{
	float sum = 0.0;
	for (int i = length - 1; i >= 0; i--) {
		sum += items[i];
	};
	return sum / length;
}

void getNewValue(float activator, float inhibitor, float effect, float val)
{
	return activator > inhibitor
		?	val + effect
		:	val - effect;
}

float averageValues(vec2 point, float radius)
{
	int samples = 0;
	float average = 0.0;
	//todo: replace with kernel. for now we just loop
  if(radius == )
	for(int x = point.x + radius; x >= point.x - radius; x--)
	{
		for(int y = point.y + radius; y >= point.y - radius; y--)
		{
			average += get(x,y)[0];
		}
	}
}

int getBestScale(float[] variations)
{
	float variation = 1000;
	int best = -1;
	for (var i = NUM_SCALES - 1; i >= 0; i--) {
		if(variations[i] < variation)
		{
			best = i;
			variation = variations[i];
		}
	};
	return best;
}

void solve (vec2 position)
{
	float val = texture2D(backbuffer, position)[0];
	//starting on scales
	//for (var i = NUM_SCALES - 1; i >= 0; i--) { //unrolled loop
	//calculating averages for scale
	activators[0] = averageValues(position, SCALES_0_ACT_RADIUS) * SCALES_0_WGT;
	inhibitors[0] = averageValues(position, SCALES_0_INH_RADIUS) * SCALES_0_WGT;
	variations[0] = abs(activators[0]-inhibitors[0]); //not averaging here

  activators[1] = averageValues(position, SCALES_1_ACT_RADIUS) * SCALES_1_WGT;
  inhibitors[1] = averageValues(position, SCALES_1_INH_RADIUS) * SCALES_1_WGT;
  variations[1] = abs(activators[1]-inhibitors[1]); //not averaging here

  activators[2] = averageValues(position, SCALES_2_ACT_RADIUS) * SCALES_2_WGT;
  inhibitors[2] = averageValues(position, SCALES_2_INH_RADIUS) * SCALES_2_WGT;
  variations[2] = abs(activators[2]-inhibitors[2]); //not averaging here

	//selecting best scale for point
	int bestscale = getBestScale(variations);

	//calculating new value for point
	val = getNewValue(val, bestscale);
	
	//normalizing
	return normalize(val);
}

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
 	//if first pass
 	//gl_FragColor = noise();
	//else {}		
	gl_FragColor = solve(position);
 
}
