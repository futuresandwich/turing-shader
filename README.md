# turing-shader 

### TODO
During each step of the simulation;

For each of the mutlitple turing scales;
1. Average each grid cell location over a circular radius specified by activator radius and store the result in the activator array. Multiply by the weight.
2. Average each grid cell location over a circular radius specified by inhibitor radius and store the result in the inhibitor array. Multiply by the weight.
3. Once the averages have been calculated, you need to work out the variation at each grid location. Within a specified variaition radius total up the variation using variation=variation+abs(activator[x,y]-inhibitor[x,y]). Store the variaition for that cell in the variation array. Remember each turing scale needs its own variation array. Smaller variation radii work the best. Checking only a single pixel for the variation formula gives the sharpest most detailed images.

Once you finally have all the activator, inhibitor and variation values for each scale calculated the grid cells can be updated. This is done by;
1. Find which of the scales has the smallest variation value. ie find which scale has the lowest variation[x,y,scalenum] value and call this bestvariation
2. Using the scale with the smallest variation, update the grid value
if activator[x,y,bestvariation]>inhibitor[x,y,bestvariation] then
grid[x,y]:=grid[x,y]+smallamounts[bestvariation]
else
grid[x,y]:=grid[x,y]-smallamounts[bestvariation]

The above step is the main gist of the algorithm. Update a single set of values based on multiple potential scales. That leads to the turing like patterns existing at the different scales within the single image.

Normalise the entire grid values to scale them back to between -1 and +1. ie find the maximum and minimum values across the grid and then update each cell
grid[x,y]:=(grid[x,y]-smallest)/range*2-1;

The grid values can now be mapped to a grayscale value (RGB intensities calculated by trunc((grid[x,y]+1)/2*255)). Alternatively you can map the value into a color palette.

Repeat the process as long as required.
