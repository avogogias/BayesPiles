var GLUtils = new GLUtils()

function GLUtils(){
    GLUtils.prototype.addBufferedRect = function(array,x,y,z,w,h, colorArray, c)
    {	
        w = w/2
        h = h/2
        array.push(
            [x-w, y-h, z],
            [x+w, y-h, z],
            [x+w, y+h, z],
            [x+w, y+h, z],
            [x-w, y+h, z],
            [x-w, y-h, z]
        )
        colorArray.push(
            [c[0], c[1], c[2]],
            [c[0], c[1], c[2]],
            [c[0], c[1], c[2]],
            [c[0], c[1], c[2]],
            [c[0], c[1], c[2]],
            [c[0], c[1], c[2]]
        )	
    }

	//TV This method draws an upper or a lower adjacent triangle
	// array: is used for the vertexPositions
	// x: is used for -y
	// y: is used for -x
	// z: always 0
	// w: width of cell is CELL_SIZE
	// h: height of cell is CELL_SIZE
	// colorArray: is used for vertexColors
	// c: always [c,c,c] for mean cover matrix
    GLUtils.prototype.addBufferedTriangle = function(array,x,y,z,w,h, colorArray, c, d)
    {		
        w = w/2
        h = h/2
        //TV array.push(
        //TV     [x-w, y-h, z],
        //TV     [x+w, y-h, z],
        //TV     [x+w, y+h, z],
        //TV     [x+w, y+h, z],
        //TV     [x-w, y+h, z],
        //TV     [x-w, y-h, z]
        //TV )
		array.push(
            [x-w, y, z],
            [x+w, y, z],
            [x, y-h, z],
            [x+w, y, z],
            [x-w, y, z],
            [x, y+h, z]
        )
		//TV [R, G, B] RGB intensities in the 6 internal angles of the 2 triangles starting with bottom right triangle from left-right-up.
        colorArray.push(
            [c[0], c[1], c[2]], //TV Bottom Triangle LEFT
            [c[0], c[1], c[2]], //TV Bottom Triangle RIGHT
            [c[0], c[1], c[2]], //TV Bottom Triangle UP
            [d[0], d[1], d[2]], //TV Top Triangle RIGHT
            [d[0], d[1], d[2]], //TV Top Triangle LEFT
            [d[0], d[1], d[2]]  //TV Top Triangle DOWN
        )
    }
	
	//TV method that draws vertical stripe (shows ML order)
    GLUtils.prototype.addBufferedStripe = function(array,x,y,z,w,h, colorArray, c, maxML, ml)
    {	
		//TV devide edge cell width in maxML stripes - e.g. for ml=0..3, maxML=4
		s = w/maxML		
        w = w/2  	
        h = h/2
        array.push(
             [x-w+ml*s, y-h, z], // lu
             [x+w-(maxML-ml-1)*s, y-h, z], // ru
             [x+w-(maxML-ml-1)*s, y+h, z], // rd
             [x+w-(maxML-ml-1)*s, y+h, z], // rd
             [x-w+ml*s, y+h, z], // ld
             [x-w+ml*s, y-h, z]	// lu
         )
		//TV [R, G, B] RGB intensities in the 6 internal angles of the 2 triangles starting with bottom right triangle from left-right-up.
        colorArray.push(
            [c[0], c[1], c[2]],
            [c[0], c[1], c[2]],
            [c[0], c[1], c[2]],
            [c[0], c[1], c[2]],
            [c[0], c[1], c[2]],
            [c[0], c[1], c[2]]
        )
    }	
	
	//TV method that draws vertical coloured stripe (shows ML order)
    GLUtils.prototype.addBufferedStripeCol = function(array,x,y,z,w,h, colorArray, c, maxML, ml)
    {	
		//TV devide edge cell width in maxML stripes - e.g. for ml=0..3, maxML=4
		s = w/maxML		
        w = w/2  	
        h = h/2
        array.push(
             [x-w+ml*s, y-h, z], // lu
             [x+w-(maxML-ml-1)*s, y-h, z], // ru
             [x+w-(maxML-ml-1)*s, y+h, z], // rd
             [x+w-(maxML-ml-1)*s, y+h, z], // rd
             [x-w+ml*s, y+h, z], // ld
             [x-w+ml*s, y-h, z]	// lu
         )
		 if ( ml == 0 )
		 {
			/* 
			// YELLOW
			colorArray.push(
				[255, 195, c[2]],
				[255, 195, c[2]],
				[255, 195, c[2]],
				[255, 195, c[2]],
				[255, 195, c[2]],
				[255, 195, c[2]]
			)
			
			// CYAN
			colorArray.push(
				[c[0], 255, 255],
				[c[0], 255, 255],
				[c[0], 255, 255],
				[c[0], 255, 255],
				[c[0], 255, 255],
				[c[0], 255, 255]
			)	
			
			// ORANGE?
			colorArray.push(
				[255, 128, c[2]],
				[255, 128, c[2]],
				[255, 128, c[2]],
				[255, 128, c[2]],
				[255, 128, c[2]],
				[255, 128, c[2]]
			)
			*/			
			// RED
			colorArray.push(
				[255, c[1], c[2]],
				[255, c[1], c[2]],
				[255, c[1], c[2]],
				[255, c[1], c[2]],
				[255, c[1], c[2]],
				[255, c[1], c[2]]
			)	
		
		 }
		 else if ( ml == 1 )
		 {
			 /*
			colorArray.push(
				[127, 201, 127],
				[127, 201, 127],
				[127, 201, 127],
				[127, 201, 127],
				[127, 201, 127],
				[127, 201, 127]
			)
			*/
			colorArray.push(
				[c[0], 255, c[2]],
				[c[0], 255, c[2]],
				[c[0], 255, c[2]],
				[c[0], 255, c[2]],
				[c[0], 255, c[2]],
				[c[0], 255, c[2]]
			)
			
		 }		 
		 else if ( ml == 2 )
		 {
			colorArray.push(
				[c[0], c[1], 255],
				[c[0], c[1], 255],
				[c[0], c[1], 255],
				[c[0], c[1], 255],
				[c[0], c[1], 255],
				[c[0], c[1], 255]
			)			 			 
		 }
		 else if ( ml == 3 )
		 {
			//TV [R, G, B] RGB intensities in the 6 internal angles of the 2 triangles starting with bottom right triangle from left-right-up.
			colorArray.push(
				[255, c[1], 255],
				[255, c[1], 255],
				[255, c[1], 255],
				[255, c[1], 255],
				[255, c[1], 255],
				[255, c[1], 255]
			)			 
		 }
		 else if ( ml == 4 ) // ML>3
		 {
			// CYAN
			colorArray.push(
				[c[0], 255, 255],
				[c[0], 255, 255],
				[c[0], 255, 255],
				[c[0], 255, 255],
				[c[0], 255, 255],
				[c[0], 255, 255]
			)		 
		 }
		 else
		 {
			// YELLOW
			colorArray.push(
				[255, 195, c[2]],
				[255, 195, c[2]],
				[255, 195, c[2]],
				[255, 195, c[2]],
				[255, 195, c[2]],
				[255, 195, c[2]]
			)				 
		 }
    }	
	
	GLUtils.prototype.addBufferedClock = function(w,h, color, lineThickness, ml)
    {
        w = w/2
        h = h/2
        var geom = new THREE.Geometry();
		
		if ( ml == 0 )
		{ 
			geom.vertices = [ 
				new THREE.Vector3( w,-h,0),
				new THREE.Vector3( -w,h,0)
				]			
		} else if ( ml == 1 )
		{
			geom.vertices = [ 
				new THREE.Vector3( 0,-h,0),
				new THREE.Vector3( 0,h,0)
				]				
		} else if ( ml == 2 )
		{
			geom.vertices = [ 
				new THREE.Vector3( -w,-h,0),
				new THREE.Vector3( w,h,0)
				]		 
		 }
		 else if ( ml == 3 )
		{ 
			geom.vertices = [ 
				new THREE.Vector3( w,h,0),
				new THREE.Vector3( -w,-h,0)
				]		 
		}		
		

        var material = new THREE.LineBasicMaterial( {
            color:  color, 
            linewidth: lineThickness,
            linejoin: 'round',
            linecap: 'round' 

        });
        
        return new THREE.Line( geom, material);		
	}
	
	
	//TV method that draws inclinated stripes (shows ML orientation using the clock metaphor)
    GLUtils.prototype.addBufferedClock2 = function(array,x,y,z,w,h, colorArray, c, maxML, ml)
    {	
		//TV devide edge cell width in maxML stripes - e.g. for ml=0..3, maxML=4
		s = w/maxML		
        w = w/2  	
        h = h/2

		//console.log("ML = " + ml);
		
		if ( ml == 0 )
		{ 
			array.push(
				[x-w, y+h-s/Math.sqrt(2), z],
				[x+w, y-h+s/Math.sqrt(2), z],
				[x+w-s/Math.sqrt(2), y-h, z],
				[x+w, y-h+s/Math.sqrt(2), z],
				[x-w, y+h-s/Math.sqrt(2), z],
				[x-w+s/Math.sqrt(2), y+h, z]
			 )				
		} else if ( ml == 1 )
		{
			array.push(
				 [x-s/2, y-h, z], // lu
				 [x+s/2, y-h, z], // ru
				 [x+s/2, y+h, z], // rd
				 [x+s/2, y+h, z], // rd
				 [x-s/2, y+h, z], // ld
				 [x-s/2, y-h, z]	// lu
			 )		
			/*
			array.push(
				 [x-s, y-h, z],
				 [x+2*s, y, z],
				 [x, y+2*h, z],
 				 [x, y+2*h, z],
				 [x-2*s, y, z],
				 [x, y-2*h, z]	
			 )
			 */
		} else if ( ml == 2 )
		{
			array.push(
				[x-w, y-h+s/Math.sqrt(2), z],
				[x+w, y+h-s/Math.sqrt(2), z],
				[x-w+s/Math.sqrt(2), y-h, z],
				[x+w, y+h-s/Math.sqrt(2), z],
				[x-w, y-h+s/Math.sqrt(2), z],
				[x+w-s/Math.sqrt(2), y+h, z]
			)			
			/*
			array.push(
				 [x-w, y-h+s, z], // 
				 [x+s, y-s, z], // 
				 [x+2*w-s, y+2*h-s, z], // 
				 [x+2*w-s, y+2*h-s, z], // 				 
				 [x-s, y+s, z], // 			 
				 [x-2*w+s, y-2*h+s, z] //  
			 )
			*/
		} else if ( ml == 3 )
		{
			array.push(
				 [x-w, y-s/2, z], // lu
				 [x+w, y-s/2, z], // ru
				 [x+w, y+s/2, z], // rd
				 [x+w, y+s/2, z], // rd
				 [x-w, y+s/2, z], // ld
				 [x-w, y-s/2, z]	// lu
			 )			 
		 }		 
		 else if ( ml == 4 )
		{
			array.push(
				[x-w, y+h/2-s/Math.sqrt(2), z],
				[x+w, y-h/2+s/Math.sqrt(2), z],
				[x+w-s/Math.sqrt(2), y-h/2, z],
				[x+w, y-h/2+s/Math.sqrt(2), z],
				[x-w, y+h/2-s/Math.sqrt(2), z],
				[x-w+s/Math.sqrt(2), y+h/2, z]
			 )				
			/*
			array.push(
				 [x-w, y-3*s/2, z], // lu
				 [x+w, y-3*s/2, z], // ru
				 [x+w, y-s/2, z], // rd
				 [x+w, y-s/2, z], // rd
				 [x-w, y-s/2, z], // ld
				 [x-w, y-3*s/2, z]	// lu
			 )
			*/
		}
		else //ML>4
		{
			array.push(
				[x-w/2, y+h-s/Math.sqrt(2), z],
				[x+w/2, y-h+s/Math.sqrt(2), z],
				[x+w/2-s/Math.sqrt(2), y-h, z],
				[x+w/2, y-h+s/Math.sqrt(2), z],
				[x-w/2, y+h-s/Math.sqrt(2), z],
				[x-w/2+s/Math.sqrt(2), y+h, z]
			 )			
		}
		 
		//TV [R, G, B] RGB intensities in the 6 internal angles of the 2 triangles starting with bottom right triangle from left-right-up.
        colorArray.push(
            [c[0], c[1], c[2]],
            [c[0], c[1], c[2]],
            [c[0], c[1], c[2]],
            [c[0], c[1], c[2]],
            [c[0], c[1], c[2]],
            [c[0], c[1], c[2]]
        )
		
		//rotateAroundWorldAxis(this, z, Math.PI / maxML * ml);
		//this.addBufferedClock.rotation.z = Math.PI / maxML * ml;
    }	
	
	//TV method that encodes MLs with Orientation and Colour
    GLUtils.prototype.addBufferedClockCol = function(array,x,y,z,w,h, colorArray, c, maxML, ml)
    {	
		//TV devide edge cell width in maxML stripes - e.g. for ml=0..3, maxML=4
		s = w/maxML		
        w = w/2  	
        h = h/2

		//brCol = ['rgb(228,26,28)','rgb(55,126,184)','rgb(77,175,74)','rgb(152,78,163)']
		brCol = [[228,26,28],[55,126,184],[77,175,74],[152,78,163]]
		
		//console.log("ML = " + ml);
		
		if ( ml == 0 )
		{ 
			array.push(
				[x-w, y+h-s/Math.sqrt(2), z],
				[x+w, y-h+s/Math.sqrt(2), z],
				[x+w-s/Math.sqrt(2), y-h, z],
				[x+w, y-h+s/Math.sqrt(2), z],
				[x-w, y+h-s/Math.sqrt(2), z],
				[x-w+s/Math.sqrt(2), y+h, z]
			 )	
			/* 
			// YELLOW
			colorArray.push(
				[255, 195, c[2]],
				[255, 195, c[2]],
				[255, 195, c[2]],
				[255, 195, c[2]],
				[255, 195, c[2]],
				[255, 195, c[2]]
			)	

			// OTHER - YELLOW+MAGENTA
			colorArray.push(
				[255, c[1], 255],
				[255, c[1], 255],
				[255, c[1], 255],
				[255, 255, 0],
				[255, 255, 0],
				[255, 255, 0]
			)
			*/
			
			// RED
			colorArray.push(
				[255, c[1], c[2]],
				[255, c[1], c[2]],
				[255, c[1], c[2]],
				[255, c[1], c[2]],
				[255, c[1], c[2]],
				[255, c[1], c[2]]
			)			
		} else if ( ml == 1 )
		{
			array.push(
				 [x-s/2, y-h, z], // lu
				 [x+s/2, y-h, z], // ru
				 [x+s/2, y+h, z], // rd
				 [x+s/2, y+h, z], // rd
				 [x-s/2, y+h, z], // ld
				 [x-s/2, y-h, z]	// lu
			 )
			
			colorArray.push( 
				[0, 255, 0],
				[0, 255, 0],
				[0, 255, 0],
				[0, 255, 0],
				[0, 255, 0],
				[0, 255, 0]
			 )
			 /*
			colorArray.push(
				[c[0], c[1], c[2]],
				[c[0], c[1], c[2]],
				[c[0], c[1], c[2]],
				[c[0], c[1], c[2]],
				[c[0], c[1], c[2]],
				[c[0], c[1], c[2]]
			)
			*/
		} else if ( ml == 2 )
		{
			array.push(
				[x-w, y-h+s/Math.sqrt(2), z],
				[x+w, y+h-s/Math.sqrt(2), z],
				[x-w+s/Math.sqrt(2), y-h, z],
				[x+w, y+h-s/Math.sqrt(2), z],
				[x-w, y-h+s/Math.sqrt(2), z],
				[x+w-s/Math.sqrt(2), y+h, z]
			)
			colorArray.push(
				[c[0], c[1], 255],
				[c[0], c[1], 255],
				[c[0], c[1], 255],
				[c[0], c[1], 255],
				[c[0], c[1], 255],
				[c[0], c[1], 255]
			)			
			
		} else if ( ml == 3 )
		{
			array.push(
				 [x-w, y-s/2, z], // lu
				 [x+w, y-s/2, z], // ru
				 [x+w, y+s/2, z], // rd
				 [x+w, y+s/2, z], // rd
				 [x-w, y+s/2, z], // ld
				 [x-w, y-s/2, z]	// lu
			 )				
			
			colorArray.push(
				[255, c[1], 255],
				[255, c[1], 255],
				[255, c[1], 255],
				[255, c[1], 255],
				[255, c[1], 255],
				[255, c[1], 255]
			)
			 
		 }		 
		 else if ( ml == 4 )
		{ 
			array.push(
				[x-w, y+h/2-s/Math.sqrt(2), z],
				[x+w, y-h/2+s/Math.sqrt(2), z],
				[x+w-s/Math.sqrt(2), y-h/2, z],
				[x+w, y-h/2+s/Math.sqrt(2), z],
				[x-w, y+h/2-s/Math.sqrt(2), z],
				[x-w+s/Math.sqrt(2), y+h/2, z]
			 )
			// CYAN
			colorArray.push(
				[c[0], 255, 255],
				[c[0], 255, 255],
				[c[0], 255, 255],
				[c[0], 255, 255],
				[c[0], 255, 255],
				[c[0], 255, 255]
			)			 	
		} // ML>4
		else
		{
			array.push(
				[x-w/2, y+h-s/Math.sqrt(2), z],
				[x+w/2, y-h+s/Math.sqrt(2), z],
				[x+w/2-s/Math.sqrt(2), y-h, z],
				[x+w/2, y-h+s/Math.sqrt(2), z],
				[x-w/2, y+h-s/Math.sqrt(2), z],
				[x-w/2+s/Math.sqrt(2), y+h, z]
			 )
			// YELLOW
			colorArray.push(
				[255, 195, c[2]],
				[255, 195, c[2]],
				[255, 195, c[2]],
				[255, 195, c[2]],
				[255, 195, c[2]],
				[255, 195, c[2]]
			)			 
		}
		 
		/*
		//TV [R, G, B] RGB intensities in the 6 internal angles of the 2 triangles starting with bottom right triangle from left-right-up.
        colorArray.push(
            [c[0], c[1], c[2]],
            [c[0], c[1], c[2]],
            [c[0], c[1], c[2]],
            [c[0], c[1], c[2]],
            [c[0], c[1], c[2]],
            [c[0], c[1], c[2]]
        )
		*/
		
		//rotateAroundWorldAxis(this, z, Math.PI / maxML * ml);
		//this.addBufferedClock.rotation.z = Math.PI / maxML * ml;
    }	
	
    GLUtils.prototype.makeBuffer3f = function(array){
        var buffer = new Float32Array( array.length * 3); // three components per vertex
        for ( var i = 0; i < array.length; i++ )
        {
            buffer[ i*3 + 0 ] = array[i][0];
            buffer[ i*3 + 1 ] = array[i][1];
            buffer[ i*3 + 2 ] = array[i][2];
        }
        return buffer  
    }

	// TV attempt to create a grid instead of a frame
    GLUtils.prototype.createRectFrameGrid = function(w,h, numN, color, lineThickness)
    {   

        w = w/2
        h = h/2
        var geom = new THREE.Geometry();
        geom.vertices = [ 
            new THREE.Vector3(-w,-h,0), 
            new THREE.Vector3(-w, h,0),
            new THREE.Vector3( w, h,0),
            new THREE.Vector3( w,-h,0),
            new THREE.Vector3(-w,-h,0)
            ]

        var material = new THREE.LineBasicMaterial( {
            color:  color, 
            linewidth: lineThickness,
            linejoin: 'round',
            linecap: 'round' 

        });
        
        return new THREE.Line( geom, material);
	
	/*
        w = w/2
        h = h/2
		s = w/numNodes		
        var geom = new THREE.Geometry();
       // geom.vertices = [ 
       //     new THREE.Vector3(-w,-h,0), 
       //     new THREE.Vector3(-w, h,0),
       //     new THREE.Vector3( w, h,0),
       //     new THREE.Vector3( w,-h,0),
       //     new THREE.Vector3(-w,-h,0)
       //     ]
				
		for (var i=0; i<numNodes+1; i++)
		{
			geom.vertices.push(new THREE.Vector3(-w + i*s,-h + i*s,0));
            geom.vertices.push(new THREE.Vector3(-w + i*s, h - i*s,0));
            geom.vertices.push(new THREE.Vector3( w - i*s, h - i*s,0));
            geom.vertices.push(new THREE.Vector3( w - i*s,-h + i*s,0));
            geom.vertices.push(new THREE.Vector3(-w + i*s,-h + i*s,0));
		}			

        var material = new THREE.LineBasicMaterial( {
            color:  color, 
            linewidth: lineThickness,
            linejoin: 'round',
            linecap: 'round' 

        });
        
        return new THREE.Line( geom, material);
	*/
	
    }	
	
    GLUtils.prototype.createRectFrame = function(w,h, color, lineThickness)
    {   
        w = w/2
        h = h/2
        var geom = new THREE.Geometry();
        geom.vertices = [ 
            new THREE.Vector3(-w,-h,0), 
            new THREE.Vector3(-w, h,0),
            new THREE.Vector3( w, h,0),
            new THREE.Vector3( w,-h,0),
            new THREE.Vector3(-w,-h,0)
            ]

        var material = new THREE.LineBasicMaterial( {
            color:  color, 
            linewidth: lineThickness,
            linejoin: 'round',
            linecap: 'round' 

        });
        
        return new THREE.Line( geom, material);
    }

    GLUtils.prototype.createRect = function(w,h, color)
    {   
        var geom = new THREE.PlaneBufferGeometry(w, h, 1 , 1)
        var m = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true, 
                opacity: 1 })
        return new THREE.Mesh(geom, m)
    }

    GLUtils.prototype.createText = function(string, x, y, z, size, color, weight){
        if(!weight)
            weight = 'normal'
        var textGeom = new THREE.TextGeometry(string, {
                size: size,
                height: 1,
                weight: weight, 
                curveSegments: 5,
                font: 'helvetiker',
                bevelEnabled: false
            })
        var textMaterial = new THREE.MeshBasicMaterial( { color: color } );
        var label = new THREE.Mesh(textGeom, textMaterial)
        label.position.set(x,y,z)
        return label
    }
    
	// TV add small circle next to each PREVIEW at bottom view of piles to indicate consensus.
	// if (this.pile.matrix.consensus)
	GLUtils.prototype.createDot = function(_color)
	{
		var radius   = 1.5,
			segments = 64,
			material = new THREE.LineBasicMaterial( { color: 0x0000ff } ), //TV circle stroke color
			geometry = new THREE.CircleGeometry( radius, segments );
		// Remove center vertex
		geometry.vertices.shift();
		//scene.add( new THREE.Line( geometry, material ) );
		//var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
		//var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
		//var mesh = new THREE.Mesh( geometry, material );
		//scene.add( mesh );
		var geometry = new THREE.CircleGeometry( radius, segments );
		var material = new THREE.MeshBasicMaterial( { color: _color } );// 0xff0000 } );	
		return new THREE.Mesh( geometry, material );
	}

				
}







function createMarker(x, y, z, color)
{   
    var l = 10;
    var geom = new THREE.Geometry();
    
    geom.vertices = [ 
        new THREE.Vector3(-l,0,0), 
        new THREE.Vector3(l, 0,0), 
        new THREE.Vector3(0,-l,0), 
        new THREE.Vector3(0, l,0), 
    ]

    var material = new THREE.LineBasicMaterial( {
        color:  color, 
        linewidth: 1        
    });
    
    var m = new THREE.Line( geom, material, THREE.LinePieces );

    m.position.set(x, y, z)
    
    return m;
}



//TV copied from https://stackoverflow.com/questions/11060734/how-to-rotate-a-3d-object-on-axis-three-js
// Rotate an object around an arbitrary axis in object space
var rotObjectMatrix;
function rotateAroundObjectAxis(object, axis, radians) {
    rotObjectMatrix = new THREE.Matrix4();
    rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);

    // old code for Three.JS pre r54:
    // object.matrix.multiplySelf(rotObjectMatrix);      // post-multiply
    // new code for Three.JS r55+:
    object.matrix.multiply(rotObjectMatrix);

    // old code for Three.js pre r49:
    // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
    // old code for Three.js r50-r58:
    // object.rotation.setEulerFromRotationMatrix(object.matrix);
    // new code for Three.js r59+:
    object.rotation.setFromRotationMatrix(object.matrix);
}

var rotWorldMatrix;
// Rotate an object around an arbitrary axis in world space       
function rotateAroundWorldAxis(object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

    // old code for Three.JS pre r54:
    //  rotWorldMatrix.multiply(object.matrix);
    // new code for Three.JS r55+:
    rotWorldMatrix.multiply(object.matrix);                // pre-multiply

    object.matrix = rotWorldMatrix;

    // old code for Three.js pre r49:
    // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
    // old code for Three.js pre r59:
    // object.rotation.setEulerFromRotationMatrix(object.matrix);
    // code for r59+:
    object.rotation.setFromRotationMatrix(object.matrix);
}

// TV Call example:
// var xAxis = new THREE.Vector3(1,0,0);
// rotateAroundWorldAxis(mesh, xAxis, Math.PI / 180);
