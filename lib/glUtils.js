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






