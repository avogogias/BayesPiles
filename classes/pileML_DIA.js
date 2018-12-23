// CONSTRUCTOR

var labelTextSpec = {
        size: 6,
        height: 1, 
        curveSegments: 3,
        font: 'helvetiker',
    }

var arr
function Pile(id, scene, nodeOrder, scale) {

    this.id = id;
    // this.coverMatrixMode = MODE_SUMMARY;
    this.coverMatrixMode = 0;
    var PILE_LABEL_GAP = 13;
    var LINE_GAP_TOP = 2;
    var LINE_GAP_BOTTOM = 3;
    var DIAGONAL_CELLS_COLOR = 'fff'

    var colors = ["#f00", "#0f0", "#00f", "#f0f", "#ff0", "#0ff"]
    var colorIndex = 0;
    var colorUsage = [0, 0, 0, 0, 0, 0];


    this.x = 0
    this.y = 0
    this.scale = scale

    this.pileMatrices = [];
   
    this.localNodeOrder = [];
    this.nodeOrder = nodeOrder

    this.globalMatrix = [];
        

    // visual states
	this.colored = false;
    this.higlighted = false
    this.showNodeLabels = false

    // is a single matrix shown only?
    this.singleMatrix 
    this.hoverGap = false

    // false if this pile got destroyed. It's merely a security tag
    // to avoid this pile being drawn. 
    this.render = true

    this.orderedLocally = false

   
    // WEBGL
    // Create webgl object 'o', to wich all visual elements are attached.
    this.scene = scene;
    this.geometry = new THREE.BufferGeometry();
    this.mesh
	this.line = [];

    this.REQUIRE_ORDER_UPDATE = true
    if(!nodeOrder){
        this.orderedLocally = true
        this.REQUIRE_ORDER_UPDATE = true
        this.nodeOrder = []
    }
    
	//this.matFrame = GLUtils.createRectFrameGrid(_matrixWidth, _matrixWidth, numNodes, 0xaaaaaa, .1)
    this.matFrame = GLUtils.createRectFrame(_matrixWidth, _matrixWidth, 0xaaaaaa, .1)
   
    /** Contains all the drawing routines.
    */
    Pile.prototype.draw = function()
    {
   
        if(this.orderedLocally && this.REQUIRE_ORDER_UPDATE){
            this.nodeOrder = calculateLocalOrder()
            this.REQUIRE_ORDER_UPDATE = false
        }

        var thisNodes = []
        for(var i=0 ; i<this.nodeOrder.length ; i++){
            if(focusNodes.indexOf(this.nodeOrder[i]) > -1)
                thisNodes.push(this.nodeOrder[i])
        }   


        //TV var numMats = this.pileMatrices.length;
        var numNodes = thisNodes.length

        // UPDATE COVER MATRIX CELLS + PILE PREVIEWS
        if(this.mesh){
            pileMeshes.splice(pileMeshes.indexOf(this.mesh),1)
            scene.remove(this.mesh)
        }
		
		//ML remove line that shows orientation
		//if (this.line){
		//	scene.remove(this.line)
		//}		

        this.geometry = new THREE.BufferGeometry();
        var vertexPositions = []
        var vertexColors = [] //TV COLOUR didn't work
        var x,y,c,v, ni, nj				
        if(this.pileMatrices.length == 1)
            this.singleMatrix = this.pileMatrices[0] 
		//TV empty consensus pile
		if(this.pileMatrices.length == 0)
		{
			console.log("DO NOTHING.");
			//alert("empty consensus");
			
		} 
		else if (this.singleMatrix && document.getElementById("orien_id").checked) 
		{
            // Show that single matrix
			// TV

			// emply 3D array of lines
			for (var i=0; i<numNodes; i++)
			{
				this.line[i] = [];
				for (var ml=0; ml<this.pileMatrices[0].matrix[0].length; ml++)
				{
					this.line[i][ml] = [];
					for (var j=0; j<numNodes; j++)
					{
						this.line[i][ml][j] = undefined;
					}
				}
			}
		
			//---------------------------SOSOSOSOSOOSOS---------------------------------------------SOSOSOSOSOOSOS----------------------
            var m = this.singleMatrix.matrix
            for(var i=0 ; i<numNodes ; i++){
                ni = thisNodes[i]
                x = - _matrixWidthHalf + CELL_SIZE/2 + i * CELL_SIZE
                //TV for(var j=i ; j<numNodes ; j++){
				for(var j=0 ; j<numNodes ; j++){	
                    nj = thisNodes[j]
                    y = + _matrixWidthHalf - CELL_SIZE/2 - j * CELL_SIZE //- CELL_SIZE*(numNodes+1.5) //TV - CELL_SIZE*(numNodes+1.5) added to leave space for the user defined consensus matrix.
					
					for(var ml=0; ml<m[0].length; ml++){
						if(this.coverMatrixMode == MODE_DIRECT_DIFFERENCE 
							&& hoveredPile
							&& this != hoveredPile){

							//TV check if consensusPile is hovered
							//console.log(hoveredPile.id)
							if (hoveredPile.id == 0)
							{
								//console.log("------ ID = 0 ------")
								v = consensusPile.globalMatrix[ni][ml][nj] - this.globalMatrix[ni][ml][nj]
								//vd = consensusPile.globalMatrix[nj][ni] - this.globalMatrix[nj][ni]
							} else					
							{								
								v = piles[piles.indexOf(hoveredPile)].globalMatrix[ni][ml][nj] - this.globalMatrix[ni][ml][nj]
								//vd = piles[piles.indexOf(hoveredPile)].globalMatrix[nj][ni] - this.globalMatrix[nj][ni]
							}						
								
							//v = piles[piles.indexOf(hoveredPile)].globalMatrix[ni][nj] - this.globalMatrix[ni][nj] 
							c = 1-Math.abs(v)
							var col
							if(v < 0){
								col = [c,c,1]
							}else{
								col = [1,c,c]                            
							}
		
							GLUtils.addBufferedStripe(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, col, m[0].length, ml)
							
						}else{ 
			//ML				c = 1-cellValue(m[ni][1][nj])
						//TV     GLUtils.addBufferedRect(vertexPositions, x,y, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c])
			//ML				GLUtils.addBufferedRect(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c])
							
							cellValue(m[ni][ml][nj])==1? c = 0: c = 1;						
//DIA							ni==nj? c = 1: null;
			//				GLUtils.addBufferedRect(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c])
						//	c==0? GLUtils.addBufferedClock(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c], m[0].length, ml): null;
						
							//if (this.line[i][ml][j])
							//	scene.remove(this.line[i][ml][j]);
							if (c==0)
							{
								//scene.remove(this.line[i][ml][j]);
								this.line[i][ml][j] = GLUtils.addBufferedClock(CELL_SIZE,CELL_SIZE, 0x000000, 20, ml);								
						        //this.mesh.add(line)
								this.line[i][ml][j].position.set(this.x-y, this.y-x, 0)
								scene.add(this.line[i][ml][j]);	
								//console.log("added line")
							}
							
						}
					} //TV endof ml
                } //TV endof j                
            } //TV endof i		
		}
		else if (this.singleMatrix && document.getElementById("orien2_id").checked) 
		{
            // Show that single matrix
			// emply 3D array of lines
			for (var i=0; i<numNodes; i++)
			{
				this.line[i] = [];
				for (var ml=0; ml<this.pileMatrices[0].matrix[0].length; ml++)
				{
					this.line[i][ml] = [];
					for (var j=0; j<numNodes; j++)
					{
						this.line[i][ml][j] = undefined;
					}
				}
			}
            var m = this.singleMatrix.matrix
            for(var i=0 ; i<numNodes ; i++){
                ni = thisNodes[i]
                x = - _matrixWidthHalf + CELL_SIZE/2 + i * CELL_SIZE
                //TV for(var j=i ; j<numNodes ; j++){
				for(var j=0 ; j<numNodes ; j++){	
                    nj = thisNodes[j]
                    y = + _matrixWidthHalf - CELL_SIZE/2 - j * CELL_SIZE //- CELL_SIZE*(numNodes+1.5) //TV - CELL_SIZE*(numNodes+1.5) added to leave space for the user defined consensus matrix.
					
					for(var ml=0; ml<m[0].length; ml++){
						cellValue(m[ni][ml][nj])==1? c = 0: c = 1;						
//DIA						ni==nj? c = 1: null; // omitt diagonal
					    c==0? this.line[i][ml][j] = GLUtils.addBufferedClock2(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c], m[0].length, ml): null;		// Only draw full mls				
					
					} //TV endof ml
                } //TV endof j                
            } //TV endof i		
		} // endof Orientation2		
		else if (this.singleMatrix && document.getElementById("orienCol_id").checked) 
		{
            // Show that single matrix
			// emply 3D array of lines
			for (var i=0; i<numNodes; i++)
			{
				this.line[i] = [];
				for (var ml=0; ml<this.pileMatrices[0].matrix[0].length; ml++)
				{
					this.line[i][ml] = [];
					for (var j=0; j<numNodes; j++)
					{
						this.line[i][ml][j] = undefined;
					}
				}
			}
            var m = this.singleMatrix.matrix
            for(var i=0 ; i<numNodes ; i++){
                ni = thisNodes[i]
                x = - _matrixWidthHalf + CELL_SIZE/2 + i * CELL_SIZE
                //TV for(var j=i ; j<numNodes ; j++){
				for(var j=0 ; j<numNodes ; j++){	
                    nj = thisNodes[j]
                    y = + _matrixWidthHalf - CELL_SIZE/2 - j * CELL_SIZE //- CELL_SIZE*(numNodes+1.5) //TV - CELL_SIZE*(numNodes+1.5) added to leave space for the user defined consensus matrix.
					
					for(var ml=0; ml<m[0].length; ml++){
						cellValue(m[ni][ml][nj])==1? c = 0: c = 1;						
//DIA						ni==nj? c = 1: null; // omitt diagonal
					    c==0? this.line[i][ml][j] = GLUtils.addBufferedClockCol(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c], m[0].length, ml): null;		// Only draw full mls				
					
					} //TV endof ml
                } //TV endof j                
            } //TV endof i		
		} // endof Orientation+Colour			
        else if(this.singleMatrix && document.getElementById("order_id").checked) { //TV this is the order default single matrix view 
            // Show that single matrix			
			// TV ----------------------------------SOSOSOSOSOOSOS---------------------------------------------SOSOSOSOSOOSOS----------------------
            var m = this.singleMatrix.matrix
            for(var i=0 ; i<numNodes ; i++){
                ni = thisNodes[i]
                x = - _matrixWidthHalf + CELL_SIZE/2 + i * CELL_SIZE
                //TV for(var j=i ; j<numNodes ; j++){
				for(var j=0 ; j<numNodes ; j++){	
                    nj = thisNodes[j]
                    y = + _matrixWidthHalf - CELL_SIZE/2 - j * CELL_SIZE //- CELL_SIZE*(numNodes+1.5) //TV - CELL_SIZE*(numNodes+1.5) added to leave space for the user defined consensus matrix.					
					for(var ml=0; ml<m[0].length; ml++){
						if(this.coverMatrixMode == MODE_DIRECT_DIFFERENCE 
							&& hoveredPile
							&& this != hoveredPile){

							//TV check if consensusPile is hovered
							//console.log(hoveredPile.id)
							if (hoveredPile.id == 0)
							{
								//console.log("------ ID = 0 ------")
								v = consensusPile.globalMatrix[ni][ml][nj] - this.globalMatrix[ni][ml][nj]
								//vd = consensusPile.globalMatrix[nj][ni] - this.globalMatrix[nj][ni]
							} else					
							{								
								v = piles[piles.indexOf(hoveredPile)].globalMatrix[ni][ml][nj] - this.globalMatrix[ni][ml][nj]
								//vd = piles[piles.indexOf(hoveredPile)].globalMatrix[nj][ni] - this.globalMatrix[nj][ni]
							}						
								
							//v = piles[piles.indexOf(hoveredPile)].globalMatrix[ni][nj] - this.globalMatrix[ni][nj] 
							c = 1-Math.abs(v)
							var col
							if(v < 0){
								col = [c,c,1]
							}else{
								col = [1,c,c]                            
							}
		
							GLUtils.addBufferedStripe(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, col, m[0].length, ml)
							
						}else{ 
		
							cellValue(m[ni][ml][nj])==1? c = 0: c = 1;						
//DIA							ni==nj? c = 1: null;
							GLUtils.addBufferedStripe(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c], m[0].length, ml)
							
						}
					} //TV endof ml

				/*	// GRID ON PERMANENT
					gridFrame = GLUtils.createRectFrame(CELL_SIZE, CELL_SIZE, 0xf0f0f0, .1) //TV 0xffcd9a, 0.5) 
					gridFrame.position.set(x + this.x,-y + this.y,0)
					gridFrame.visible = true
					scene.add(gridFrame)
				*/
				
                } //TV endof j                
            } //TV endof i
        }
        else if(this.singleMatrix && document.getElementById("orderCol_id").checked) { //TV this is the order default single matrix view 
            // Show that single matrix			
			// TV ----------------------------------SOSOSOSOSOOSOS---------------------------------------------SOSOSOSOSOOSOS----------------------
            var m = this.singleMatrix.matrix
            for(var i=0 ; i<numNodes ; i++){
                ni = thisNodes[i]
                x = - _matrixWidthHalf + CELL_SIZE/2 + i * CELL_SIZE
                //TV for(var j=i ; j<numNodes ; j++){
				for(var j=0 ; j<numNodes ; j++){	
                    nj = thisNodes[j]
                    y = + _matrixWidthHalf - CELL_SIZE/2 - j * CELL_SIZE //- CELL_SIZE*(numNodes+1.5) //TV - CELL_SIZE*(numNodes+1.5) added to leave space for the user defined consensus matrix.					
					for(var ml=0; ml<m[0].length; ml++){
						if(this.coverMatrixMode == MODE_DIRECT_DIFFERENCE 
							&& hoveredPile
							&& this != hoveredPile){

							//TV check if consensusPile is hovered
							//console.log(hoveredPile.id)
							if (hoveredPile.id == 0)
							{
								//console.log("------ ID = 0 ------")
								v = consensusPile.globalMatrix[ni][ml][nj] - this.globalMatrix[ni][ml][nj]
								//vd = consensusPile.globalMatrix[nj][ni] - this.globalMatrix[nj][ni]
							} else					
							{								
								v = piles[piles.indexOf(hoveredPile)].globalMatrix[ni][ml][nj] - this.globalMatrix[ni][ml][nj]
								//vd = piles[piles.indexOf(hoveredPile)].globalMatrix[nj][ni] - this.globalMatrix[nj][ni]
							}						
								
							//v = piles[piles.indexOf(hoveredPile)].globalMatrix[ni][nj] - this.globalMatrix[ni][nj] 
							c = 1-Math.abs(v)
							var col
							if(v < 0){
								col = [c,c,1]
							}else{
								col = [1,c,c]                            
							}
		
							GLUtils.addBufferedStripeCol(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, col, m[0].length, ml)
							
						}else{ 
		
							cellValue(m[ni][ml][nj])==1? c = 0: c = 1;						
//DIA							ni==nj? c = 1: null;
							GLUtils.addBufferedStripeCol(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c], m[0].length, ml)
							
						}
					} //TV endof ml

				/*	// GRID ON PERMANENT
					gridFrame = GLUtils.createRectFrame(CELL_SIZE, CELL_SIZE, 0xf0f0f0, .1) //TV 0xffcd9a, 0.5) 
					gridFrame.position.set(x + this.x,-y + this.y,0)
					gridFrame.visible = true
					scene.add(gridFrame)
				*/
				
                } //TV endof j                
            } //TV endof i
        }		
		else
		{ 		// TV not only one matrix in the pile
			   // TV will be the cover matrix of MEANS which is the default: so here the opacity is drawn ------- JUST EDGE FILTER -----
            if (document.getElementById("cbox").checked) 
			{
				//TV console.log("FILTER ON!") // TV 
				var thres = +document.getElementById("percentageThresSlider").value/100; // TV normalise threshold
				//var dt
				//var cdts = [] // TV store records of c and down triangle
				for(var i=0 ; i<numNodes ; i++)
				{
					ni = thisNodes[i]
					x = - _matrixWidthHalf + CELL_SIZE/2 + i * CELL_SIZE //TV this calculates "x" position based on "i"
					//TV for(var j=i ; j<numNodes ; j++){
					for(var j=0 ; j<numNodes ; j++)
					{	
						nj = thisNodes[j]
						v = 0;
						y = + _matrixWidthHalf - CELL_SIZE/2 - j * CELL_SIZE			
						for(var t=0 ; t<this.pileMatrices.length ; t++)
						{
							v += this.pileMatrices[t].matrix[ni][1][nj]; 
						}
						v /= this.pileMatrices.length
						//console.log(v, thres)
						if (v<thres)
							c = 1;
						else
							c = 1-Math.max(0,cellValue(v)); //c = 0;
						GLUtils.addBufferedRect(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c])
					}
				}		
			}
			else if (document.getElementById("orien_id").checked) // ML orientation mode
			{
				for(var i=0 ; i<numNodes ; i++){
					ni = thisNodes[i]
					x = - _matrixWidthHalf + CELL_SIZE/2 + i * CELL_SIZE
					//TV for(var j=i ; j<numNodes ; j++){
					for(var j=0 ; j<numNodes ; j++){	
						nj = thisNodes[j]
						v = 0;
						y = + _matrixWidthHalf - CELL_SIZE/2 - j * CELL_SIZE	
						if(this.coverMatrixMode == MODE_DIRECT_DIFFERENCE
							&& hoveredPile
							&& this != hoveredPile){
								
							//TV check if consensusPile is hovered
							//console.log(hoveredPile.id)
							if (hoveredPile.id == 0)
							{
								//console.log("------ ID = 0 ------")
								v = consensusPile.globalMatrix[ni][nj] - this.globalMatrix[ni][nj];
							} else					
							{								
								v = piles[piles.indexOf(hoveredPile)].globalMatrix[ni][nj] - this.globalMatrix[ni][nj];
							}								
								
							c = 1-Math.abs(v)
							var col

							if(v < 0){
								col = [c,c,1]
							}else{
								col = [1,c,c]                            
							}
							
							GLUtils.addBufferedRect(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
						}else //TV default MEANS cover matrix here:
						{
							for (var ml=0; ml<this.pileMatrices[0].matrix[0].length ; ml++)
							{
								v = 0;
								for(var t=0 ; t<this.pileMatrices.length ; t++){
									v += this.pileMatrices[t].matrix[ni][ml][nj]; 
								}
								v /= this.pileMatrices.length
								c = 1-Math.max(0,cellValue(v))
//DIA								i==j? c = 1: null;
								
								GLUtils.addBufferedRect(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c])
								//TV GLUtils.addBufferedClock(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c], this.pileMatrices[0].matrix[0].length, ml)							
							}
						}
					}
				}		
			}
			else if (document.getElementById("orien2_id").checked) // ML orientation mode 2
			{
				for(var i=0 ; i<numNodes ; i++){
					ni = thisNodes[i]
					x = - _matrixWidthHalf + CELL_SIZE/2 + i * CELL_SIZE
					//TV for(var j=i ; j<numNodes ; j++){
					for(var j=0 ; j<numNodes ; j++){	
						nj = thisNodes[j]
						v = 0;
						y = + _matrixWidthHalf - CELL_SIZE/2 - j * CELL_SIZE	
						if(this.coverMatrixMode == MODE_DIRECT_DIFFERENCE
							&& hoveredPile
							&& this != hoveredPile){
								
							//TV check if consensusPile is hovered
							//console.log(hoveredPile.id)
							if (hoveredPile.id == 0)
							{
								//console.log("------ ID = 0 ------")
								v = consensusPile.globalMatrix[ni][nj] - this.globalMatrix[ni][nj];
							} else					
							{								
								v = piles[piles.indexOf(hoveredPile)].globalMatrix[ni][nj] - this.globalMatrix[ni][nj];
							}								
								
							c = 1-Math.abs(v)
							var col

							if(v < 0){
								col = [c,c,1]
							}else{
								col = [1,c,c]                            
							}
							
							for(var ml=0; ml<m[0].length; ml++)
							{
								cellValue(m[ni][ml][nj])==1? c = 0: c = 1;						
//DIA								ni==nj? c = 1: null; // omitt diagonal
								c==0? this.line[i][ml][j] = GLUtils.addBufferedClock2(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, col, m[0].length, ml): null;		// Only draw full mls				
							
							} //TV endof ml							
							//GLUtils.addBufferedRect(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
						}else //TV default MEANS cover matrix here:
						{
							for (var ml=0; ml<this.pileMatrices[0].matrix[0].length ; ml++)
							{
								v = 0;
								for(var t=0 ; t<this.pileMatrices.length ; t++){
									v += this.pileMatrices[t].matrix[ni][ml][nj]; 
								}
								v /= this.pileMatrices.length
								c = 1-Math.max(0,cellValue(v))
//DIA								i==j? c = 1: null;
								c!=1? GLUtils.addBufferedClock2(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c], this.pileMatrices[0].matrix[0].length, ml): null;		// Only draw full mls												
							}
						}
					}
				}		
			}	
			else if (document.getElementById("orienCol_id").checked) // ML orientation mode + Colour in Piles
			{
				for(var i=0 ; i<numNodes ; i++){
					ni = thisNodes[i]
					x = - _matrixWidthHalf + CELL_SIZE/2 + i * CELL_SIZE
					//TV for(var j=i ; j<numNodes ; j++){
					for(var j=0 ; j<numNodes ; j++){	
						nj = thisNodes[j]
						v = 0;
						y = + _matrixWidthHalf - CELL_SIZE/2 - j * CELL_SIZE	
						if(this.coverMatrixMode == MODE_DIRECT_DIFFERENCE
							&& hoveredPile
							&& this != hoveredPile){
								
							//TV check if consensusPile is hovered
							//console.log(hoveredPile.id)
							if (hoveredPile.id == 0)
							{
								//console.log("------ ID = 0 ------")
								v = consensusPile.globalMatrix[ni][nj] - this.globalMatrix[ni][nj];
							} else					
							{								
								v = piles[piles.indexOf(hoveredPile)].globalMatrix[ni][nj] - this.globalMatrix[ni][nj];
							}								
								
							c = 1-Math.abs(v)
							var col

							if(v < 0){
								col = [c,c,1]
							}else{
								col = [1,c,c]                            
							}
							
							for(var ml=0; ml<m[0].length; ml++)
							{
								cellValue(m[ni][ml][nj])==1? c = 0: c = 1;						
//DIA								ni==nj? c = 1: null; // omitt diagonal
								c==0? this.line[i][ml][j] = GLUtils.addBufferedClockCol(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, col, m[0].length, ml): null;		// Only draw full mls				
							
							} //TV endof ml							
							//GLUtils.addBufferedRect(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
						}else //TV default MEANS cover matrix here:
						{
							for (var ml=0; ml<this.pileMatrices[0].matrix[0].length ; ml++)
							{
								v = 0;
								for(var t=0 ; t<this.pileMatrices.length ; t++){
									v += this.pileMatrices[t].matrix[ni][ml][nj]; 
								}
								v /= this.pileMatrices.length
								c = 1-Math.max(0,cellValue(v))
//DIA								i==j? c = 1: null;
								c!=1? GLUtils.addBufferedClockCol(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c], this.pileMatrices[0].matrix[0].length, ml): null;		// Only draw full mls												
							}
						}
					}
				}		
			}			
			else if (document.getElementById("order_id").checked) // ML order in piles 
			{
				for(var i=0 ; i<numNodes ; i++){
					ni = thisNodes[i]
					x = - _matrixWidthHalf + CELL_SIZE/2 + i * CELL_SIZE
					//TV for(var j=i ; j<numNodes ; j++){
					for(var j=0 ; j<numNodes ; j++){	
						nj = thisNodes[j]
						v = 0;
						y = + _matrixWidthHalf - CELL_SIZE/2 - j * CELL_SIZE //- CELL_SIZE*(numNodes+1.5) //TV - CELL_SIZE*(numNodes+1.5) added to leave space for the user defined consensus matrix.

						if(this.coverMatrixMode == MODE_DIRECT_DIFFERENCE
							&& hoveredPile
							&& this != hoveredPile){
								
							//TV check if consensusPile is hovered
							//console.log(hoveredPile.id)
							if (hoveredPile.id == 0)
							{
								//console.log("------ ID = 0 ------")
								v = consensusPile.globalMatrix[ni][nj] - this.globalMatrix[ni][nj];
							} else					
							{								
								v = piles[piles.indexOf(hoveredPile)].globalMatrix[ni][nj] - this.globalMatrix[ni][nj];
							}								
								
							//v = piles[piles.indexOf(hoveredPile)].globalMatrix[ni][nj] - this.globalMatrix[ni][nj] 
							c = 1-Math.abs(v)
							var col

							if(v < 0){
								col = [c,c,1]
							}else{
								col = [1,c,c]                            
							}
							
						//TV     GLUtils.addBufferedRect(vertexPositions, x, y, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
							GLUtils.addBufferedRect(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
						}else //TV default MEANS cover matrix here:
						{
							for (var ml=0; ml<this.pileMatrices[0].matrix[0].length ; ml++)
							{
								v = 0;
								for(var t=0 ; t<this.pileMatrices.length ; t++){
									v += this.pileMatrices[t].matrix[ni][ml][nj]; 
								}
								v /= this.pileMatrices.length
								c = 1-Math.max(0,cellValue(v))

//DIA								i==j? c = 1: null;						
								GLUtils.addBufferedStripe(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c], this.pileMatrices[0].matrix[0].length, ml)							
							}
						}
					}
				} // TV endof for loop to all nodes in the pile execute it only if checkbox of edge filters is not checked?
			}
			else if (document.getElementById("orderCol_id").checked) // ML order in piles 
			{
				for(var i=0 ; i<numNodes ; i++){
					ni = thisNodes[i]
					x = - _matrixWidthHalf + CELL_SIZE/2 + i * CELL_SIZE
					//TV for(var j=i ; j<numNodes ; j++){
					for(var j=0 ; j<numNodes ; j++){	
						nj = thisNodes[j]
						v = 0;
						y = + _matrixWidthHalf - CELL_SIZE/2 - j * CELL_SIZE //- CELL_SIZE*(numNodes+1.5) //TV - CELL_SIZE*(numNodes+1.5) added to leave space for the user defined consensus matrix.

						if(this.coverMatrixMode == MODE_DIRECT_DIFFERENCE
							&& hoveredPile
							&& this != hoveredPile){
								
							//TV check if consensusPile is hovered
							//console.log(hoveredPile.id)
							if (hoveredPile.id == 0)
							{
								//console.log("------ ID = 0 ------")
								v = consensusPile.globalMatrix[ni][nj] - this.globalMatrix[ni][nj];
							} else					
							{								
								v = piles[piles.indexOf(hoveredPile)].globalMatrix[ni][nj] - this.globalMatrix[ni][nj];
							}								
								
							//v = piles[piles.indexOf(hoveredPile)].globalMatrix[ni][nj] - this.globalMatrix[ni][nj] 
							c = 1-Math.abs(v)
							var col

							if(v < 0){
								col = [c,c,1]
							}else{
								col = [1,c,c]                            
							}
							
						//TV     GLUtils.addBufferedRect(vertexPositions, x, y, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
							GLUtils.addBufferedRect(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
						}else //TV default MEANS cover matrix here:
						{
							for (var ml=0; ml<this.pileMatrices[0].matrix[0].length ; ml++)
							{
								v = 0;
								for(var t=0 ; t<this.pileMatrices.length ; t++){
									v += this.pileMatrices[t].matrix[ni][ml][nj]; 
								}
								v /= this.pileMatrices.length
								c = 1-Math.max(0,cellValue(v))

//DIA							i==j? c = 1: null;						
								GLUtils.addBufferedStripeCol(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c], this.pileMatrices[0].matrix[0].length, ml)							
							}
						}
					}
				} // TV endof for loop to all nodes in the pile execute it only if checkbox of edge filters is not checked?
			}			
        } // TV endof not single matrix
       
		//TV SOSOSOSOS for correcting OUT/IN-DEGREE shown in piles!!!!!!!!!!!!!!----------------------------- DONE
        // UPDATE PREVIEWS
        var m
        var highlight

		//TV	for(var t=0 ; t<this.pileMatrices.length && this.pileMatrices.length > 1 ; t++){ //TV also show pile for a single matrix
		for(var t=0 ; t<this.pileMatrices.length && this.pileMatrices.length > 0 ; t++)
		{
			m = this.pileMatrices[t].matrix
			y = _matrixWidthHalf + (PREVIEW_SIZE*(t+1))

			// test if matrix is single, if so highlight its preview
			highlight = false

			//TV this calculates pile values based on OUT-DEGREE    --    TODO
			var v = [];
			for(var i=0; i<numNodes ; i++)
			{
				v[i] = 0;
			}
			for(var i=0; i<numNodes ; i++)
			{
				for(var j=0; j<numNodes ; j++)
				{
					//console.log(m[thisNodes[i]][thisNodes[j]]);
					v[j] = v[j] + m[thisNodes[i]][1][thisNodes[j]];   
				}
				//console.log(v[i]);
			}
			for(var j=0; j<numNodes; j++)
			{
				//console.log(v[j]);
				c = 1 - cellValue(v[j]/numNodes)
				if(highlight){
					c -= (1 - c) * .7 
				}
				x = -_matrixWidthHalf + CELL_SIZE * j + CELL_SIZE/2
				if(PILING_DIRECTION == 'vertical'){
					GLUtils.addBufferedRect(vertexPositions,x, y, .5, CELL_SIZE, PREVIEW_SIZE, vertexColors, [1,1,1])
					GLUtils.addBufferedRect(vertexPositions,x, y, .5, CELL_SIZE, PREVIEW_SIZE-.3, vertexColors, [c,c,c])
				}else{
					GLUtils.addBufferedRect(vertexPositions,y, x, .5, PREVIEW_SIZE, CELL_SIZE, vertexColors, [1,1,1])
					GLUtils.addBufferedRect(vertexPositions,y, x, .5, PREVIEW_SIZE-.3, CELL_SIZE, vertexColors, [c,c,c])
				}
			}		
		}			
        
        // CREATE GAP to next matrix
        if(hoveredGapPile && hoveredGapPile == this)
            c = [1,1,1] // c = [1,.7,.7] //TV: the gap between piles was shown with red on hover
        else
            c = [1,1,1]

        GLUtils.addBufferedRect( 
            vertexPositions,
            _matrixWidthHalf + MATRIX_GAP_HORIZONTAL/2, 
            0, 
            -1, 
            MATRIX_GAP_HORIZONTAL, _matrixWidth, 
            vertexColors, c)

         // CREATE + ADD MESH
        this.geometry.addAttribute( 'position', new THREE.BufferAttribute( GLUtils.makeBuffer3f(vertexPositions), 3 ));
        this.geometry.addAttribute( 'customColor', new THREE.BufferAttribute( GLUtils.makeBuffer3f(vertexColors), 3 ));
        this.mesh = new THREE.Mesh(this.geometry, shaderMaterial);
        this.mesh.scale.set(this.scale, this.scale , this.scale )
         
        // DRAW PILE TOOLS IF NECESSARY
        var LETTER_SPACE = 6
        // console.log('this == hoveredPile',this == hoveredPile)
       
        // ADD PILE ID LABEL
		if (piles.indexOf(this) == -1)
	        var label = GLUtils.createText("Consensus", -_matrixWidthHalf-4, -_matrixWidthHalf - 24, 0, 9, '0x888888' )
		else
			var label = GLUtils.createText(piles.indexOf(this)+1, -_matrixWidthHalf-2, -_matrixWidthHalf - 14, 0, 9, '0x888888' )
        label.scale.set(1 / this.scale, 1 / this.scale, 1 / this.scale)
        this.mesh.add(label)

        // ADD MATRIX LABELS
        var string = ''
        if(this.pileMatrices.length > 1){
            if(this.singleMatrix)
                string = matrices.indexOf(this.singleMatrix) + '/' +  this.pileMatrices.length
            else
                string = (matrices.indexOf(this.pileMatrices[0])+1) + '-' + (matrices.indexOf(this.pileMatrices[this.pileMatrices.length-1])+1) + ' (' + this.pileMatrices.length + ')'
        
            label = GLUtils.createText(string, -_matrixWidthHalf + 20, -_matrixWidthHalf - 12, 0, 7, '0xffffff' )
            label.scale.set(1 / this.scale, 1 / this.scale, 1 / this.scale)
            this.mesh.add(label)
        }
		
//THAN: also add red dots
			for(var t=0 ; t<this.pileMatrices.length && this.pileMatrices.length > 0 ; t++)
			{
				
				// TV add a red dot next to PREVIEW if matrix belongs to consensus pile.
				//var dotmesh
				if ((this.pileMatrices[t].consensus) && (this.id != 0))
				{
					dotmesh = GLUtils.createDot(0xff0000) //(0x0080ff)

					dotmesh.position.set(_matrixWidthHalf+2, _matrixWidthHalf+3+t*3, 0)
					//dotmesh.position.set(x + this.x + CELL_SIZE, this.y + y,0)
					dotmesh.scale.set(1 / this.scale, 1 / this.scale, 1 / this.scale)
					this.mesh.add(dotmesh)
				//	scene.add(dotmesh);
				}
				else if (this.id != 0)
				{
					dotmesh = GLUtils.createDot(0xffffff)
					dotmesh.position.set(x + this.x + CELL_SIZE, this.y + y,0)
					//scene.remove(dotmesh);
					scene.add(dotmesh);
				}
				
			}		
		
        // FINISH
        this.mesh.add(this.matFrame)
        this.matFrame.position.set(-1, -1, .1)
   
        this.mesh.pile = this;
        pileMeshes.push(this.mesh)
		if (this.id == 0)
			this.mesh.position.set(this.x, -70, 0)
		else
			this.mesh.position.set(this.x, this.y, 0)
        scene.add(this.mesh)
    }

    this.cellFrame = GLUtils.createRectFrame(CELL_SIZE, CELL_SIZE, 0xaaaaaa, .1) //TV 0xff0000, 1)
    Pile.prototype.updateHoveredCell = function(){
        if(hoveredCell){
            this.mesh.add(this.cellFrame)
            x = -_matrixWidthHalf + CELL_SIZE * hoveredCell.col + CELL_SIZE_HALF 
            y = _matrixWidthHalf - CELL_SIZE * hoveredCell.row - CELL_SIZE_HALF 
            this.cellFrame.position.set(x,y,1) 
       }else if ((this.mesh.children) && (this.mesh.children.indexOf(this.cellFrame) > -1)){
            this.mesh.remove(this.cellFrame)
        }    
    }

    Pile.prototype.updateLabels = function(b)
    {
        if(hoveredCell && b){
            x = -_matrixWidthHalf + CELL_SIZE * hoveredCell.col + CELL_SIZE_HALF 
            y = _matrixWidthHalf - CELL_SIZE * hoveredCell.row - CELL_SIZE_HALF 
            var sCol = nodes[focusNodes[hoveredCell.col]].name
            var rCol = GLUtils.createRect(10 * sCol.length, 12, 0xffffff)
            rCol.position.set(
                x + 10 * sCol.length/2 -3, 
                _matrixWidthHalf + 10, 
                2)
            this.mesh.add(rCol)
            var colLabel = GLUtils.createText(sCol, 
                x, 
                _matrixWidthHalf + 5, 
                2, 
                9, 0x000000)
            this.mesh.add(colLabel)

            var sRow = nodes[focusNodes[hoveredCell.row]].name
            var rRow = GLUtils.createRect(10 * sRow.length, 12, 0xffffff)
            rRow.position.set(
                _matrixWidthHalf + 4 + 10*sRow.length/2, 
                y+4, 
                2)
            this.mesh.add(rRow)
            var rowLabel = GLUtils.createText(sRow, 
                +_matrixWidthHalf + 5, 
                y, 
                2, 
                9, 0x000000)
            this.mesh.add(rowLabel)
        }else{

        }
    } 

    /* Frame requires update after matrix size has changed through 
    ** filtering */ 
    Pile.prototype.updateFrame = function(){
		//this.matFrame = GLUtils.createRectFrameGrid(_matrixWidth, _matrixWidth, numNodes, 0xaaaaaa, .1)
         this.matFrame = GLUtils.createRectFrame(_matrixWidth, _matrixWidth, 0xaaaaaa, .1)
    }



    Pile.prototype.showSingle = function(matrix) 
    {
        this.singleMatrix = matrix
    }

    Pile.prototype.hoverGap = function(b) 
    {
        this.hoverGap = b
    }


    Pile.prototype.moveTo = function (x, y, animate) 
    {
        this.x = x
        this.y = -y
        this.mesh.position.set(x, -y,0)
    }

    Pile.prototype.elevateTo = function (z){
        this.z = z
        this.mesh.position.set(this.x, this.y, z)
    } 


    Pile.prototype.setCoverMatrixMode = function(mode)
    {
        this.coverMatrixMode = mode;
    }




    Pile.prototype.getLocalOrder = function(){
        return this.localNodeOrder
    }

    Pile.prototype.calculateLocalOrder = function()
    {
        if(!this.REQUIRE_ORDER_UPDATE){
            return this.localNodeOrder
        }
        this.REQUIRE_ORDER_UPDATE = false
        var numNodes = nodes.length
        this.localNodeOrder = []

        for (var i=0 ; i<numNodes ;i++) {
            this.localNodeOrder.push(0)
            this.globalMatrix[i] = [];
            for (var j=0 ; j< numNodes; j++) {
                this.globalMatrix[i][j] = 0;
            }
        }
        var times = this.pileMatrices.length
        for (var i=0 ;i < numNodes ;i++) {
            //TV for (var j=i; j < numNodes ;j++) {
			for (var j=0; j < numNodes ;j++) {	
                for (var t=0 ;t < times ;t++) {
                    this.globalMatrix[i][j] += Math.abs(this.pileMatrices[t].matrix[i][1][j])
                }
                this.globalMatrix[i][j] /= times
                //TV this.globalMatrix[j][i] = this.globalMatrix[i][j]
            }
        }
        var leafOrder = reorder.leafOrder()
          .distance(science.stats.distance.manhattan)(this.globalMatrix);
        
        this.localNodeOrder = []
        var _this = this;
        var a=0;
        leafOrder.forEach(function (lo, i) {
            _this.localNodeOrder[i] = lo;
        });
        return this.localNodeOrder
    }

	//TV calculates for each pile of t matrices the cover superimposed global matrix with the average of all edge weights 
    Pile.prototype.calculateGlobalMatrix = function()
    { 
        this.globalMatrix = [];
        var numNodes = this.nodeOrder.length
        for (var i=0 ; i<numNodes ;i++) {
            this.localNodeOrder.push(0)
            this.globalMatrix[i] = [];
            for (var j=0 ; j< numNodes; j++) {
                this.globalMatrix[i][j] = 0;
            }
        }
        var times = this.pileMatrices.length
        for (var i=0 ;i < numNodes ;i++) {
            //TV for (var j=i; j < numNodes ;j++) {
			for (var j=0; j < numNodes ;j++) {	
                for (var t=0 ;t < times ;t++) {
                    this.globalMatrix[i][j] += Math.abs(this.pileMatrices[t].matrix[i][1][j])
                }
                this.globalMatrix[i][j] /= times
                //TV this.globalMatrix[j][i] = this.globalMatrix[i][j]
            }
        }
    }

    
    Pile.prototype.setNodeOrder = function(nodeOrder, orderedLocally){
        if(!orderedLocally)
            this.orderedLocally = false
        else
            this.orderedLocally = orderedLocally
        
        this.nodeOrder = nodeOrder;
    }

    Pile.prototype.invertOrder = function(){
        this.nodeOrder = this.nodeOrder.reverse()         
        // this.localNodeOrder = this.localNodeOrder.reverse()
    }
    


    Pile.prototype.destroy = function(){
        pileMeshes.splice(pileMeshes.indexOf(this.mesh),1)
        this.geometry.dispose()
        scene.remove(this.mesh)
        this.render = false;
        pileMatrices = []
    }     



    /** Adds a set of matrices to this pile */
    Pile.prototype.addMatrices = function (matrices) 
    {
        var m;
        // if(this.nodeOrder.length == 0)
        //     this.nodeOrder = matrices[0].nodeOrder;

        var n = this.nodeOrder.length;
        for (var i = 0 ; i < matrices.length ; i++) {
            m = matrices[i];
            this.pileMatrices.push(m);
            m.pile = this;
        }
        this.singleMatrix = undefined
        this.REQUIRE_ORDER_UPDATE = true
        this.calculateGlobalMatrix()
    }

    /** remove the specifid matrices from the pile.  
     If any were the visible matrix,
     then make the remaining last element of the pile visible.
     redraw the remaining labels at the correct positions. */
    Pile.prototype.removeMatrices = function (matrices) {
        for (var i = 0; i < matrices.length; i++) {
            var m = matrices[i];
            for (var j = 0; j < this.pileMatrices.length; j++) {
                if (m === this.pileMatrices[j]) {
                    if (m.visible) wasvisible = true;
                    this.pileMatrices.splice(j, 1);
                    break;
                }
            }
        }
        this.REQUIRE_ORDER_UPDATE = true
        this.calculateGlobalMatrix()
    }

    Pile.prototype.showLabels = function(b){
        this.showNodeLabels = b
    }

    /** Returns the position of a matrix in the pile */
    Pile.prototype.getMatrixPosition = function (matrix) {
        return this.pileMatrices.indexOf(matrix);
    }

    /** Gets the matrix at a given position */
    Pile.prototype.getMatrix = function (index) {
        return this.pileMatrices[index];
    }
    
    /** Returns whether this pile contains that matrix objec */
    Pile.prototype.contains = function (matrix) {
        return this.pileMatrices.indexOf(matrix) > -1;
    }

    /** Returns the number of matrices in this pile*/
    Pile.prototype.size = function () {
        return this.pileMatrices.length;
    }

    /** Returns the last matrix in this pile */
    Pile.prototype.getLast = function () {
        return this.pileMatrices[this.pileMatrices.length-1];
    }


    Pile.prototype.getMatrices = function () {
        return this.pileMatrices
    }
    
    Pile.prototype.getPos = function () {
        return this.mesh.position
    }
    

    Pile.prototype.scaleTo = function (s) {
        this.scale = s;
        this.mesh.scale.set(s,s,s)
        // this.mesh.updateMatrix()
    }

	// TV instead of a rect draw a grid
    Pile.prototype.updateCellSize = function () {
        //this.matFrame = GLUtils.createRectFrameGrid(_matrixWidth, _matrixWidth, numNodes, 0xaaaaaa, .1)
		this.matFrame = GLUtils.createRectFrame(_matrixWidth, _matrixWidth, 0xaaaaaa, .1)
		//TV console.log("zoom")
		
	/*	for (var i=0; i<this.line[0].length; i++)
		{
			for (var ml=0; ml<this.line[0][0].length; ml++)
			{
				for (var j=0; j<this.line[0].length; j++)
				{
					scene.remove(this.line[i][ml][j]);
					//this.line[i][ml][j] = GLUtils.addBufferedClock(CELL_SIZE,CELL_SIZE, 0x000000, CELL_SIZE, ml);								
					//this.line[i][ml][j].position.set(this.x-y, this.y-x, 0)
					//scene.add(this.line[i][ml][j]);	
					//console.log("added line")
				}
			}
		} */		
		
    }


	//TV Each matrix has a consensus status (true/false). Each pile also has a inConsensus status which depends on the matrices it contains. If at least one is getConsensus == true then the whole pile is inConsensus.
    Pile.prototype.inConsensus = function () {
        //if(this.pileMatrices.length == 1)
        //    return this.pileMatrices[0].getConsensus(); 
        for (var i = 0; i < this.pileMatrices.length; i++) {
			if (this.pileMatrices[i].getConsensus())
				return true;
		}
		return false;
    }


}

