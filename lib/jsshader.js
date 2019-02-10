//using http://softologyblog.wordpress.com/2011/07/05/multi-scale-turing-patterns/
void get(vec2 dimensions, vec2 point)
{
	x = wrap(point.x,dimensions.x);
	y = wrap(point.y,dimensions.y);
	return texture2D(backbuffer,vec2(x,y));
}

//-------------------
void solve (grid, scales)
{
	//console.log("starting on scales")
		for (var i = scales.length - 1; i >= 0; i--) {
			console.log("calculating averages for scale "+i);
			var scale = scales[i];
			scale.activators = this.calculateAverages(scale.activatorRadius, scale.weight, grid);
			scale.inhibitors = this.calculateAverages(scale.inhibitorRadius, scale.weight, grid);
			scale.variations = this.calculateVariations(scale.activators, scale.inhibitors, this.variationRadius);
		};
		console.log("selecting and solving for final grid");
		for(var y = 0; y < h; y++)
		{
			for (var x = 0; x < w; x++)
			{
				//console.log("selecting best scale for "+x+", "+y);
				var bestscale = this.getBestScale(scales, x, y);
				//console.log("calculating new value for "+x+", "+y);
				grid.put(x,y,this.getNewValue(grid, bestscale, x, y));
			}
		}
		console.log("normalizing");
		grid.normalize();

}
void calculateVariations(float[] activators, float[] inhibitors)  
{
	//used to do this over a radius, don't know why. 

	for (var x = 0; x < data.width; x++)
	{
		
		for(var y = 0; y < data.height; y++)
		{
			variation = 0;
			actCells = act.getCellsAround(x,y,radius);
			inhCells = inh.getCellsAround(x,y,radius);
			for (var i = actCells.length - 1; i >= 0; i--) {
				variation += Math.abs(actCells[i]-inhCells[i]);
			};
			data.put(x,y,variation);
		}
	}
	return data;
}
void calculateAverages(radius, weight, grid)
{
	var data = new Grid(grid.width,grid.height);
	
	for(var y = 0; y < this.grid.height; y++)
	{
		for (var x = 0; x < this.grid.width; x++)
		{
			data.put(x,y,this.averageValues(grid.getCellsAround(x,y,radius)) * weight);
		}
	}
	return data;
}
void averageValues(items)
{
	if(items.length == 0)
		return 0;
	var sum = 0.0;
	for (var i = items.length - 1; i >= 0; i--) {
		sum += items[i];
	};
	return sum / items.length;
}
void getNewValue(grid, scale, x, y)
{
	var v = scale.activators.get(x,y) > scale.inhibitors.get(x,y)
		?	grid.get(x,y)+scale.effect
		:	grid.get(x,y)-scale.effect;
	return v;
}
void getBestScale(scales, x, y)
{
	var scale = scales[0];
	for (var i = scales.length - 1; i >= 0; i--) {
		if(scales[i].variations.get(x,y) < scale.variations.get(x,y))
			scale = scales[i];
	};
	return scale;
}
void draw(grid) 
{
	var ctx = this.c.getContext("2d");
  	var imgData = ctx.getImageData(0, 0, this.c.width, this.c.height);
	for(var y = 0; y < this.grid.height; y++)
	{
		for (var x = 0; x < this.grid.width; x++)
		{
			this.putPixel(imgData, x, y, this.mapToColor(grid.get(x,y)));
    	}
    }
  	//slap it back on the original canvas
 	ctx.putImageData(imgData,0,0);
 	this.encoder.addFrame(ctx);
 	this.frameBuffer.push()
}
void putPixel(imgData, x, y, color)
{
	var baseIndex = (x+(y*imgData.width))*4;
	for (var i = 0; i < color.length; i++) {
		imgData.data[baseIndex+i] = color[i];
	};
}
void mapToColor(val)
{
	var c = (val+1.0)/2.0;
	 b = Math.cos(c*Math.PI)/2.0+0.5;
	 g = Math.cos(c*Math.PI-Math.PI/2.0)/2.0+0.5;
	 r = Math.cos(c*Math.PI-Math.PI)/2.0+0.5;
	//cy = Math.cos(c*Math.PI)/2.0+0.5;
	//ma = Math.cos(c*Math.PI-Math.PI)/2.0+0.5;
	 return new Array(Math.floor(r*3)*128,Math.floor(g*3)*128,Math.floor(b*3)*128,255);
	//return new Array(cy*255,((cy+ma)/2.0)*255,ma*255,255);
}
void fillRandom(grid)
{	
	for (var i = grid.items.length - 1; i >= 0; i--) {
		grid.items[i] = Math.random()*2.0 - 1.0;
	};
}
void tick(simulator)
{
	//simulator.solve(simulator.grid, simulator.scales);
	console.log("solving...");
	simulator.solve(simulator.grid, simulator.scales);
	//simulator.grid = debugCircle(simulator.grid);
	console.log("drawing...");
	simulator.draw(simulator.grid);
	requestAnimationFrame(function() { simulator.tick(simulator) },100);
}
void run()
{
	console.log("started. initializing grid.");
	this.fillRandom(this.grid);
	console.log("first draw");
	this.draw(this.grid);
	console.log("beginning simulation");
	this.tick(this);
}
void debugCircle (g)
{
	for (var i = g.items.length - 1; i >= 0; i--) {
		g.items[i] = 0.0;
	};
	for (var i = g.items.length - 1; i >= 0; i--) {
		g.items[i] = -1.0;
	};
	var circle = g.getCellsAround(gx,gy, 5);
	for (var i = circle.length - 1; i >= 0; i--) {
		g.put(circle[i][0], circle[i][1], 1.0);
	};
	g.put(gx,gy,1.0);
			
	gy--;
	gx--;
	return g;
}
put(x,y,val)
{
	x = this._wrap(x,this.width);
	y = this._wrap(y,this.height);
	this.items[x+(y*this.width)] = val;
	this.smallest = 'undefined';
	this.largets = 'undefined';
}
void getCellsAround(tx,ty,radius)
{
	tx = this._wrap(tx, this.width);
	ty = this._wrap(ty, this.height);
	var tempData = new Array(radius*2*radius*2);
	var tempCount = 0;
	if(this.cacheNeighbours)
	{
		if(!window._neighbourCache || !window._neighbourCache[radius])
		{
			this._createNeighbourCache(radius);
		}

		var neighbours = window._neighbourCache[radius][tx][ty];
		
		for (var i = neighbours.length - 1; i >= 0; i--) {
			tempData[tempCount] =  this.get(neighbours[i][0],neighbours[i][1]); //new Array(neighbours[i][0],neighbours[i][1]); //debug
			tempCount++;
		};
	} else {
		for(var y = ty - radius; y <= ty + radius; y++)
			{
				for(var x = tx-radius; x <= tx + radius; x++)
				{
					if(Math.sqrt(Math.pow(tx-x,2) + Math.pow(ty-y,2)) <= radius)
					{
						tempData[tempCount] = this.get(x,y); //new Array(x,y);// 
						tempCount++;
					}
				}
			}
	}
	return tempData.slice(0,tempCount);

}
void createNeighbourCache(radius)
{
	console.log("creating neighbours cache");
	if(!window._neighbourCache)
		window._neighbourCache = new Array();
	 if(!window._neighbourCache[radius])
	 	window._neighbourCache[radius] = new Array();
	for(var ty = 0; ty < this.height; ty++)
	{
		for (var tx = 0; tx < this.width; tx++)
		{
			if(!window._neighbourCache[radius][tx])
				window._neighbourCache[radius][tx] = new Array();
			
			if(!window._neighbourCache[radius][tx][ty])
				window._neighbourCache[radius][tx][ty] = new Array();
			
			for(var y = ty - radius; y <= ty + radius; y++)
			{
				for(var x = tx-radius; x <= tx + radius; x++)
				{
					if(Math.sqrt(Math.pow(tx-x,2) + Math.pow(ty-y,2)) <= radius)
					{
						window._neighbourCache[radius][tx][ty].push(new Array(x,y));
					}
				}
			}
		}
	}
}
void normalize()
{
	var smallest = this.getSmallest();
	var largest = this.getLargest();
	var range = largest - smallest;
	for (var i = this.items.length - 1; i >= 0; i--) {
		this.items[i]  = ((this.items[i] - smallest) / range * 2) - 1;
	};
	this.smallest = 'undefined';
	this.largest = 'undefined';
}
void _wrap (val,limit)
{
	if(val < 0) return limit - Math.abs(val) % limit;
	if(val >= limit) return val % limit;
	return val;
}
void getSmallest ()
{
	if(this.smallest != 'undefined')
		return smallest;
	this.smallest = 1000;
	for (var i = this.items.length - 1; i >= 0; i--) {
		if(this.smallest > this.items[i])
			this.smallest = this.items[i];
	};
	return this.smallest;
}
void getLargest()
{
	if(this.largest != 'undefined')
		return this.largest;
	this.largest = -1000;
	for (var i = this.items.length - 1; i >= 0; i--) {
		if(this.largest < this.items[i])
			this.largest = this.items[i];
	};
	return this.largest;
}

void main()
{
	
}

var TuringSimulation = function(c) {
	var w = 16;
	var h = 16;
	this.c = c;
	this.c.width = w;
	this.c.height = h;
	this.grid = new Grid(w,h);
	this.cacheNeighbours = false;
	
	this.scales = new Array(
		//new Scale(10, 20, 0.05, 1, 3),
		//new Scale(20, 40, 0.2, 1, 2),
		//new Scale(10, 20, 0.15, 1.0, 2),
		new Scale(4, 8, 0.1, 1.0, 2),
		new Scale(1, 2, 0.05, 1.0, 2)
		);
	this.variationRadius = 3.0;
	
	
	
	this.frameBuffer = [];

	var 
	this.saveGif = function()
	{
		this.encoder.finish(); 

		var binary_gif = this.encoder.stream().getData(); //notice this is different from the as3gif package! 
		//alert(binary_gif);
		var data_url = 'data:image/gif;base64,'+encode64(binary_gif);

		var img = $('<img />').attr({ 'id': 'savedGif', 'src': data_url }).appendTo($(document));

		this.encoder.start();
	}
}
var gx=0;
	var gy=0;
var Scale = function(act, inh, eft, wgt, sym) {
	this.activatorRadius = act;
	this.inhibitorRadius = inh;
	this.effect = eft;
	this.weight = wgt;
	this.symmetry = sym;
	this.activators = new Grid(0,0);
	this.inhibitors = new Grid(0,0);
	this.variations = new Grid(0,0);
}

var Grid = function(w,h)
{
	this.smallest = 'undefined';
	this.largest = 'undefined';
	this.items = new Array(w*h);
}