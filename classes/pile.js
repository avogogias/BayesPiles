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

    this.REQUIRE_ORDER_UPDATE = true
    if(!nodeOrder){
        this.orderedLocally = true
        this.REQUIRE_ORDER_UPDATE = true
        this.nodeOrder = []
    }
    
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
			
		} else if(this.singleMatrix && document.getElementById("dim_id").checked) { //TV document.getElementById("cbox2").checked){
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
                    c = 1-cellValue(m[ni][nj])
					d = 1-cellValue(m[nj][ni])
					// TV skip diagonal for autocorrelation in diamond mode
					if (i==j)
					{
						c = 1
						d = 1
					}
                    //TV     GLUtils.addBufferedRect(vertexPositions, x,y, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c])
                        GLUtils.addBufferedTriangle(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c], [d,d,d])
                		



					
					// TV aim to support Cover Matrix Modes for diamond mode
					if(this.coverMatrixMode == MODE_DIFFERENCE 
                        && piles.indexOf(this) > 0){ 
                        v = this.globalMatrix[ni][nj] - piles[piles.indexOf(this)-1].globalMatrix[ni][nj]; 
                        c = 1-Math.abs(v)
						vd = this.globalMatrix[nj][ni] - piles[piles.indexOf(this)-1].globalMatrix[nj][ni]; 
                        d = 1-Math.abs(vd)
                        var col
                        if(v > 0){
                            col = [c,c,1]
                        }else{
                            col = [1,c,c]                            
                        }
						var col2
                        if(vd > 0){
                            col2 = [d,d,1]
                        }else{
                            col2 = [1,d,d]                            
                        }
                        
                    //TV      GLUtils.addBufferedRect(vertexPositions, x, y, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
					//TV	GLUtils.addBufferedRect(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
						GLUtils.addBufferedTriangle(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, col, col2)
						
                    }
                    else 
                    if(this.coverMatrixMode == MODE_DIRECT_DIFFERENCE 
                        && hoveredPile
                        && this != hoveredPile){
													
						//TV check if consensusPile is hovered
						//console.log(hoveredPile.id)
						if (hoveredPile.id == 0)
						{
							//console.log("------ ID = 0 ------")
							v = consensusPile.globalMatrix[ni][nj] - this.globalMatrix[ni][nj]
							vd = consensusPile.globalMatrix[nj][ni] - this.globalMatrix[nj][ni]
						} else					
						{								
							v = piles[piles.indexOf(hoveredPile)].globalMatrix[ni][nj] - this.globalMatrix[ni][nj]
							vd = piles[piles.indexOf(hoveredPile)].globalMatrix[nj][ni] - this.globalMatrix[nj][ni]
						}

						//TV this is the consensusPile
						//if (this.id == 0)
						//{
						//	v = piles[piles.indexOf(hoveredPile)].globalMatrix[ni][nj] - consensusPile.globalMatrix[ni][nj]
						//	vd = piles[piles.indexOf(hoveredPile)].globalMatrix[nj][ni] - consensusPile.globalMatrix[nj][ni] 
						//}	
						
                        //TV v = piles[piles.indexOf(hoveredPile)].globalMatrix[ni][nj] - this.globalMatrix[ni][nj] 
                        c = 1-Math.abs(v)
						//TV vd = piles[piles.indexOf(hoveredPile)].globalMatrix[nj][ni] - this.globalMatrix[nj][ni] 
                        d = 1-Math.abs(vd)						
                        var col
                        if(v < 0){
                            col = [c,c,1]
                        }else{
                            col = [1,c,c]                            
                        }
						var col2
                        if(vd < 0){
                            col2 = [d,d,1]
                        }else{
                            col2 = [1,d,d]                            
                        }
                        
                    //TV        GLUtils.addBufferedRect(vertexPositions, x, y, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
                    //TV    GLUtils.addBufferedRect(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
						GLUtils.addBufferedTriangle(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, col, col2)
                    }else{ 
                        c = 1-cellValue(m[ni][nj])
                        d = 1-cellValue(m[nj][ni])					
                    //TV     GLUtils.addBufferedRect(vertexPositions, x,y, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c])
                    //TV    GLUtils.addBufferedRect(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c])
						GLUtils.addBufferedTriangle(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c], [d,d,d])	
                    }
					
					
					
					//SINGLE
					//TV create a grid frame and set on/off with a checkbox							GRID ON/OFF
					if (document.getElementById("gr_id").checked)
					{	
						gridFrame = GLUtils.createRectFrame(CELL_SIZE, CELL_SIZE, 0xf0f0f0, .1) //TV 0xffcd9a, 0.5) 
						gridFrame.position.set(x + this.x,-y + this.y,0)
						gridFrame.visible = true
						scene.add(gridFrame)				
					}else
					{
						gridFrame = GLUtils.createRectFrame(CELL_SIZE, CELL_SIZE, 0xffffff, .1) //TV 0xffcd9a, 0.5) 
						gridFrame.position.set(x + this.x,-y + this.y,0)
						gridFrame.visible = true
						scene.add(gridFrame)						
					}
					//	scene.remove(gridFrame) //TODO remove grid					
					
					
					
					
                } //TV endof j                
            } //TV endof i
        }		
        else if(this.singleMatrix && !document.getElementById("sk_id").checked) { //TV this is the top-down default single matrix view !document.getElementById("cbox3").checked){
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
                    if(this.coverMatrixMode == MODE_DIFFERENCE 
                        && piles.indexOf(this) > 0){ 
                        v = this.globalMatrix[ni][nj] - piles[piles.indexOf(this)-1].globalMatrix[ni][nj]; 
                        c = 1-Math.abs(v)
                        var col
                        if(v > 0){
                            col = [c,c,1]
                        }else{
                            col = [1,c,c]                            
                        }
                        
                    //TV      GLUtils.addBufferedRect(vertexPositions, x, y, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
						GLUtils.addBufferedRect(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
                    }
                    else 
                    if(this.coverMatrixMode == MODE_DIRECT_DIFFERENCE 
                        && hoveredPile
                        && this != hoveredPile){

						//TV check if consensusPile is hovered
						//console.log(hoveredPile.id)
						if (hoveredPile.id == 0)
						{
							//console.log("------ ID = 0 ------")
							v = consensusPile.globalMatrix[ni][nj] - this.globalMatrix[ni][nj]
							//vd = consensusPile.globalMatrix[nj][ni] - this.globalMatrix[nj][ni]
						} else					
						{								
							v = piles[piles.indexOf(hoveredPile)].globalMatrix[ni][nj] - this.globalMatrix[ni][nj]
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
                        
                    //TV        GLUtils.addBufferedRect(vertexPositions, x, y, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
                        GLUtils.addBufferedRect(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
                    }else{ 
                        c = 1-cellValue(m[ni][nj])
                    //TV     GLUtils.addBufferedRect(vertexPositions, x,y, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c])
                        GLUtils.addBufferedRect(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c])
                    }
					

					//SINGLE + TOP-DOWN
					//TV create a grid frame and set on/off with a checkbox							GRID ON/OFF
					if (document.getElementById("gr_id").checked)
					{	
						gridFrame = GLUtils.createRectFrame(CELL_SIZE, CELL_SIZE, 0xf0f0f0, .1) //TV 0xffcd9a, 0.5) 
						gridFrame.position.set(x + this.x,-y + this.y,0)
						gridFrame.visible = true
						scene.add(gridFrame)				
					}else
					{
						gridFrame = GLUtils.createRectFrame(CELL_SIZE, CELL_SIZE, 0xffffff, .1) //TV 0xffcd9a, 0.5) 
						gridFrame.position.set(x + this.x,-y + this.y,0)
						gridFrame.visible = true
						scene.add(gridFrame)						
					}
					//	scene.remove(gridFrame) //TODO remove grid	

					
					
                } //TV endof j                
            } //TV endof i
        }
		else if(this.singleMatrix && document.getElementById("sk_id").checked)//TV document.getElementById("cbox3").checked)
		{
            // Show that single matrix												-- TODO --
            var m = this.singleMatrix.matrix
            for(var i=0 ; i<numNodes ; i++){
                ni = thisNodes[i]
                x = - _matrixWidthHalf + CELL_SIZE/2 + i * CELL_SIZE //+ CELL_SIZE*(numNodes+1.5) //TV - CELL_SIZE*(numNodes+1.5) added to leave space for the user defined consensus matrix.
                //TV for(var j=i ; j<numNodes ; j++){
				for(var j=0 ; j<numNodes ; j++){
                    nj = thisNodes[j]
                    y = + _matrixWidthHalf - CELL_SIZE/2 - j * CELL_SIZE 
                    if(this.coverMatrixMode == MODE_DIFFERENCE 
                        && piles.indexOf(this) > 0){ 
                        v = this.globalMatrix[ni][nj] + this.globalMatrix[nj][ni] - piles[piles.indexOf(this)-1].globalMatrix[ni][nj] - piles[piles.indexOf(this)-1].globalMatrix[nj][ni]; 
                        c = 1-Math.abs(v)
                        var col
                        if(v > 0){
                            col = [c,c,1]
                        }else{
                            col = [1,c,c]                            
                        }
                        
                        GLUtils.addBufferedRect(vertexPositions, x, y, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
                        GLUtils.addBufferedRect(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
                    }
                    else 
                    if(this.coverMatrixMode == MODE_DIRECT_DIFFERENCE 
                        && hoveredPile
                        && this != hoveredPile){
							
						//TV check if consensusPile is hovered
						//console.log(hoveredPile.id)
						if (hoveredPile.id == 0)
						{
							//console.log("------ ID = 0 ------")
							v = consensusPile.globalMatrix[ni][nj] + consensusPile.globalMatrix[nj][ni] - this.globalMatrix[ni][nj] - this.globalMatrix[nj][ni];
						} else					
						{								
							v = piles[piles.indexOf(hoveredPile)].globalMatrix[ni][nj] + piles[piles.indexOf(hoveredPile)].globalMatrix[nj][ni] - this.globalMatrix[ni][nj] - this.globalMatrix[nj][ni];
						}							
							
                        //v = piles[piles.indexOf(hoveredPile)].globalMatrix[ni][nj] + piles[piles.indexOf(hoveredPile)].globalMatrix[nj][ni] - this.globalMatrix[ni][nj] - this.globalMatrix[nj][ni];
                        c = 1-Math.abs(v)
                        var col
                        if(v < 0){
                            col = [c,c,1]
                        }else{
                            col = [1,c,c]                            
                        }
                        
                        GLUtils.addBufferedRect(vertexPositions, x, y, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
                        GLUtils.addBufferedRect(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
                    }else{ 
                        c = 1-cellValue(m[ni][nj])-cellValue(m[nj][ni]) //TV true either this or its symmetrical is there
                         GLUtils.addBufferedRect(vertexPositions, x,y, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c])
                        //TV GLUtils.addBufferedRect(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c])
                    }
					
					

					//SINGLE + SKELETON
					//TV create a grid frame and set on/off with a checkbox							GRID ON/OFF
					if (document.getElementById("gr_id").checked)
					{	
						gridFrame = GLUtils.createRectFrame(CELL_SIZE, CELL_SIZE, 0xf0f0f0, .1) //TV 0xffcd9a, 0.5) 
						gridFrame.position.set(x + this.x,-y + this.y,0)
						gridFrame.visible = true
						scene.add(gridFrame)				
					}else
					{
						gridFrame = GLUtils.createRectFrame(CELL_SIZE, CELL_SIZE, 0xffffff, .1) //TV 0xffcd9a, 0.5) 
						gridFrame.position.set(x + this.x,-y + this.y,0)
						gridFrame.visible = true
						scene.add(gridFrame)						
					}
					//	scene.remove(gridFrame) //TODO remove grid	
					
					
					
                }                
            } 			
		}
		else
		{ 		// TV not only one matrix in the pile
			   // Show cover matrix 
			  // a pile which sums up edges regardless to their direction             	---- SKELETON MODE ----
			 //TV																	    ***	NO EDGE FILTER ***
			 if (document.getElementById("sk_id").checked && !document.getElementById("cbox").checked)
			 //TV if (document.getElementById("cbox3").checked && !document.getElementById("cbox").checked)
			 {			  
		        // Show cover matrix 
				//TV only MEAN case considered here.
				for(var i=0 ; i<numNodes ; i++)
				{
					ni = thisNodes[i]
					x = - _matrixWidthHalf + CELL_SIZE/2 + i * CELL_SIZE //+ CELL_SIZE*(numNodes+1.5) //TV - CELL_SIZE*(numNodes+1.5) added to leave space for the user defined consensus matrix.
					//TV for(var j=i ; j<numNodes ; j++){
					for(var j=0 ; j<numNodes ; j++)
					{
						nj = thisNodes[j]
						v = 0;
		                y = + _matrixWidthHalf - CELL_SIZE/2 - j * CELL_SIZE 
						
						/*
						for(var t=0 ; t<this.pileMatrices.length ; t++){
							//TV v += this.pileMatrices[t].matrix[ni][nj]; 
							v += this.pileMatrices[t].matrix[ni][nj] + this.pileMatrices[t].matrix[nj][ni];
						}
						v /= this.pileMatrices.length
						c = 1-Math.max(0,cellValue(v))
					   
						GLUtils.addBufferedRect(vertexPositions, x, y, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c])
						//TV GLUtils.addBufferedRect(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c])
						*/
						
						
						
						
						
						
						if(this.coverMatrixMode == MODE_DIFFERENCE 
							&& piles.indexOf(this) > 0){
							v = this.globalMatrix[ni][nj] + this.globalMatrix[nj][ni] - piles[piles.indexOf(this)-1].globalMatrix[ni][nj] - piles[piles.indexOf(this)-1].globalMatrix[nj][ni]; 
							c = 1-Math.abs(v)
							var col
							if(v > 0){
								col = [c,c,1]
							}else{
								col = [1,c,c]                            
							}
							
							//TV     GLUtils.addBufferedRect(vertexPositions, x, y, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
							GLUtils.addBufferedRect(vertexPositions, x, y, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
						}else     
						if(this.coverMatrixMode == MODE_DIRECT_DIFFERENCE
							&& hoveredPile
							&& this != hoveredPile){						

							//TV check if consensusPile is hovered
							//console.log(hoveredPile.id)
							if (hoveredPile.id == 0)
							{
								//console.log("------ ID = 0 ------")
								v = consensusPile.globalMatrix[ni][nj] + consensusPile.globalMatrix[nj][ni] - this.globalMatrix[ni][nj] - this.globalMatrix[nj][ni];
							} else					
							{								
								v = piles[piles.indexOf(hoveredPile)].globalMatrix[ni][nj] + piles[piles.indexOf(hoveredPile)].globalMatrix[nj][ni] - this.globalMatrix[ni][nj] - this.globalMatrix[nj][ni];
							}									
								
							//v = piles[piles.indexOf(hoveredPile)].globalMatrix[ni][nj] + piles[piles.indexOf(hoveredPile)].globalMatrix[nj][ni] - this.globalMatrix[ni][nj] - this.globalMatrix[nj][ni]
							
							c = 1-Math.abs(v)
							var col

							if(v < 0){
								col = [c,c,1]
							}else{
								col = [1,c,c]                            
							}	
							//TV     GLUtils.addBufferedRect(vertexPositions, x, y, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
							GLUtils.addBufferedRect(vertexPositions, x, y, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
						}else //TV default MEANS cover matrix here:
						{
							/*
							for(var t=0 ; t<this.pileMatrices.length ; t++){
								v += this.pileMatrices[t].matrix[ni][nj]; 
							}
							v /= this.pileMatrices.length
							c = 1-Math.max(0,cellValue(v))
							GLUtils.addBufferedRect(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c])
							*/
							
							for(var t=0 ; t<this.pileMatrices.length ; t++){
								v += this.pileMatrices[t].matrix[ni][nj] + this.pileMatrices[t].matrix[nj][ni];
							}
							v /= this.pileMatrices.length
							c = 1-Math.max(0,cellValue(v))
							GLUtils.addBufferedRect(vertexPositions, x, y, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c])
						
						}
						
						
						
						
						
						
					}
				}
			 }
			 else if (document.getElementById("sk_id").checked)//TV (document.getElementById("cbox3").checked)			 
	   		  // TV -------------												------- SKELETON && EDGE FILTER -----  
			 {
				// TODO  
				var thres = +document.getElementById("percentageThresSlider").value/100; // TV normalise threshold
		        // Show cover matrix 
				//TV only MEAN case considered here.
				for(var i=0 ; i<numNodes ; i++)
				{
					ni = thisNodes[i]
					x = - _matrixWidthHalf + CELL_SIZE/2 + i * CELL_SIZE //- CELL_SIZE*(numNodes+1.5) //TV - CELL_SIZE*(numNodes+1.5) added to leave space for the user defined consensus matrix.
					//TV for(var j=i ; j<numNodes ; j++){
					for(var j=0 ; j<numNodes ; j++)
					{
						nj = thisNodes[j]
						v = 0;
						y = + _matrixWidthHalf - CELL_SIZE/2 - j * CELL_SIZE 
						
						
						
						
						if(this.coverMatrixMode == MODE_DIFFERENCE 
							&& piles.indexOf(this) > 0){
							v = this.globalMatrix[ni][nj] + this.globalMatrix[nj][ni] - piles[piles.indexOf(this)-1].globalMatrix[ni][nj] - piles[piles.indexOf(this)-1].globalMatrix[nj][ni]; 
							c = 1-Math.abs(v)
							var col
							if(v > 0){
								col = [c,c,1]
							}else{
								col = [1,c,c]                            
							}
							
							//TV     GLUtils.addBufferedRect(vertexPositions, x, y, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
							GLUtils.addBufferedRect(vertexPositions, x, y, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
						}else     
						if(this.coverMatrixMode == MODE_DIRECT_DIFFERENCE
							&& hoveredPile
							&& this != hoveredPile){
								
							//TV check if consensusPile is hovered
							//console.log(hoveredPile.id)
							if (hoveredPile.id == 0)
							{
								//console.log("------ ID = 0 ------")
								v = consensusPile.globalMatrix[ni][nj] + consensusPile.globalMatrix[nj][ni] - this.globalMatrix[ni][nj] - this.globalMatrix[nj][ni];
							} else					
							{								
								v = piles[piles.indexOf(hoveredPile)].globalMatrix[ni][nj] + piles[piles.indexOf(hoveredPile)].globalMatrix[nj][ni] - this.globalMatrix[ni][nj] - this.globalMatrix[nj][ni];
							}								
								
							//v = piles[piles.indexOf(hoveredPile)].globalMatrix[ni][nj] + piles[piles.indexOf(hoveredPile)].globalMatrix[nj][ni] - this.globalMatrix[ni][nj] - this.globalMatrix[nj][ni]
							
							c = 1-Math.abs(v)
							var col

							//if (c<thres)
							//	col = [1,1,1]
							//else 
							if(v < 0){
								col = [c,c,1]
							}else{
								col = [1,c,c]                            
							}	
							//TV     GLUtils.addBufferedRect(vertexPositions, x, y, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
							GLUtils.addBufferedRect(vertexPositions, x, y, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
						}else //TV default MEANS cover matrix here:
						{
							for(var t=0 ; t<this.pileMatrices.length ; t++){
								//TV v += this.pileMatrices[t].matrix[ni][nj]; 
								v += this.pileMatrices[t].matrix[ni][nj] + this.pileMatrices[t].matrix[nj][ni];
							}
							v /= this.pileMatrices.length
							//TV c = 1-Math.max(0,cellValue(v))
							
							if (v<thres)
								c = 1;
							else
								c = 1-Math.max(0,cellValue(v)); //c = 0;
						   
							GLUtils.addBufferedRect(vertexPositions, x, y, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c])
							//TV GLUtils.addBufferedRect(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c])
						}
						
						
						/*
						for(var t=0 ; t<this.pileMatrices.length ; t++){
							//TV v += this.pileMatrices[t].matrix[ni][nj]; 
							v += this.pileMatrices[t].matrix[ni][nj] + this.pileMatrices[t].matrix[nj][ni];
						}
						v /= this.pileMatrices.length
						//TV c = 1-Math.max(0,cellValue(v))
						
						if (v<thres)
							c = 1;
						else
							c = 1-Math.max(0,cellValue(v)); //c = 0;
					   
						GLUtils.addBufferedRect(vertexPositions, x, y, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c])
						//TV GLUtils.addBufferedRect(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c])
						*/
					}
				}												
			 } 
			 else if (document.getElementById("dim_id").checked)//TV (document.getElementById("cbox2").checked) //TV			------ DIRECTED && EDGE FILTER ------
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
						y = + _matrixWidthHalf - CELL_SIZE/2 - j * CELL_SIZE //- CELL_SIZE*(numNodes+1.5) //TV - CELL_SIZE*(numNodes+1.5) added to leave space for the user defined consensus matrix.
	

	
	
	
						if(this.coverMatrixMode == MODE_DIFFERENCE 
							&& piles.indexOf(this) > 0){
							v = this.globalMatrix[ni][nj] - piles[piles.indexOf(this)-1].globalMatrix[ni][nj]; 
							c = 1-Math.abs(v)
							var col
							if(v > 0){
								col = [c,c,1]
							}else{
								col = [1,c,c]                            
							}
							
							vd = this.globalMatrix[nj][ni] - piles[piles.indexOf(this)-1].globalMatrix[nj][ni]; 
							d = 1-Math.abs(vd)
							var col2
							if(vd > 0){
								col2 = [d,d,1]
							}else{
								col2 = [1,d,d]                            
							}
							
							GLUtils.addBufferedTriangle(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, col, col2)
						}else     
						if(this.coverMatrixMode == MODE_DIRECT_DIFFERENCE
							&& hoveredPile
							&& this != hoveredPile){
							//TV check if consensusPile is hovered
							//console.log(hoveredPile.id)
							if (hoveredPile.id == 0)
							{
								//console.log("------ ID = 0 ------")
								v = consensusPile.globalMatrix[ni][nj] - this.globalMatrix[ni][nj]
								vd = consensusPile.globalMatrix[nj][ni] - this.globalMatrix[nj][ni]
							} else if (this.id == 0)
							{	
								console.log("------ this.ID = 0 ------")					
							} else
							{								
								v = piles[piles.indexOf(hoveredPile)].globalMatrix[ni][nj] - this.globalMatrix[ni][nj]
								vd = piles[piles.indexOf(hoveredPile)].globalMatrix[nj][ni] - this.globalMatrix[nj][ni]
							}
							c = 1-Math.abs(v)
							var col
							if(v < 0){
								col = [c,c,1]
							}else{
								col = [1,c,c]                            
							}							
							d = 1-Math.abs(vd)
							var col2	
							if(vd < 0){
								col2 = [d,d,1]
							}else{
								col2 = [1,d,d]                            
							}							

							//if (c<thres)
							//	col = [1,1,1]
							//else 
	
							GLUtils.addBufferedTriangle(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, col, col2)
						}else //TV default MEANS cover matrix here:
						{
							/*
							for(var t=0 ; t<this.pileMatrices.length ; t++){
								//TV v += this.pileMatrices[t].matrix[ni][nj]; 
								v += this.pileMatrices[t].matrix[ni][nj] + this.pileMatrices[t].matrix[nj][ni];
							}
							v /= this.pileMatrices.length
							//TV c = 1-Math.max(0,cellValue(v))
							
							if (v<thres)
								c = 1;
							else
								c = 1-Math.max(0,cellValue(v)); //c = 0;
						   
							GLUtils.addBufferedTriangle(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c], [d,d,d])
							*/
	
						
							for(var t=0 ; t<this.pileMatrices.length ; t++)
							{
								v += this.pileMatrices[t].matrix[ni][nj]; 
							}
							v /= this.pileMatrices.length
							//console.log(v, thres)
							if (document.getElementById("cbox").checked && v<thres)
								c = 1;
							else
								c = 1-Math.max(0,cellValue(v)); //c = 0;
							
							
							// TV exp
							v2 = 0;
							for(var t=0 ; t<this.pileMatrices.length ; t++)
							{
								v2 += this.pileMatrices[t].matrix[nj][ni]; 
							}
							v2 /= this.pileMatrices.length
							if (document.getElementById("cbox").checked && v2<thres) //lower
								d = 1;
							else //upper
								d = 1-Math.max(0,cellValue(v2));
							
							//console.log(v, thres, -y, -x, 0, CELL_SIZE, c, d)
							// TV skip diagonal for autocorrelation in diamond mode
							if (i==j)
							{
								c = 1
								d = 1
							}
							//GLUtils.prototype.addBufferedTriangle = function(array,x,y,z,w,h, colorArray, c)
							GLUtils.addBufferedTriangle(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c], [d,d,d])
							//TV GLUtils.addBufferedRect(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c])
							
							//TV add frame around diamond cells to make comparisons easier 
							//TVif (this.mesh)
							//TV{
							//TV	this.diaCellFrame = GLUtils.createRectFrame(CELL_SIZE, CELL_SIZE, 0xff0000, 1)
							//TV	this.mesh.add(this.diaCellFrame)
								//x = -_matrixWidthHalf + CELL_SIZE * hoveredCell.col + CELL_SIZE_HALF 
								//y = _matrixWidthHalf - CELL_SIZE * hoveredCell.row - CELL_SIZE_HALF 
								//this.diaCellFrame.position.set(x,y,1) 
							//TV	this.diaCellFrame.position.set(-y,-x,1)
							//TV}
							
						}
							
							
						//MULTI
						//TV create a grid frame and set on/off with a checkbox							GRID ON/OFF
						if (document.getElementById("gr_id").checked)
						{	
							gridFrame = GLUtils.createRectFrame(CELL_SIZE, CELL_SIZE, 0xf0f0f0, .1) //TV 0xffcd9a, 0.5) 
							gridFrame.position.set(x + this.x,-y + this.y,0)
							gridFrame.visible = true
							scene.add(gridFrame)				
						}else
						{
							gridFrame = GLUtils.createRectFrame(CELL_SIZE, CELL_SIZE, 0xffffff, .1) //TV 0xffcd9a, 0.5) 
							gridFrame.position.set(x + this.x,-y + this.y,0)
							gridFrame.visible = true
							scene.add(gridFrame)						
						}
						//	scene.remove(gridFrame) //TODO remove grid	


						
					}
				}					 
			 }
			  // TV will be the cover matrix of MEANS which is the default: so here the opacity is drawn ------- JUST EDGE FILTER -----
            else if (document.getElementById("cbox").checked && !document.getElementById("dim_id").checked) //TV !document.getElementById("cbox2").checked)//TV (!document.getElementById("percentageThresSlider").disabled)
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
							v += this.pileMatrices[t].matrix[ni][nj]; 
						}
						v /= this.pileMatrices.length
						//console.log(v, thres)
						if (v<thres)
							c = 1;
						else
							c = 1-Math.max(0,cellValue(v)); //c = 0;
						
						
						// TV exp
						//v2 = 0;
						//for(var t=0 ; t<this.pileMatrices.length ; t++)
						//{
						//	v2 += this.pileMatrices[t].matrix[nj][ni]; 
						//}
						//v2 /= this.pileMatrices.length
						//if (v2<thres) //lower
						//	d = 1;
						//else //upper
						//	d = 1-Math.max(0,cellValue(v2));
						
						//console.log(v, thres, -y, -x, 0, CELL_SIZE, c, d)
						
						//GLUtils.prototype.addBufferedTriangle = function(array,x,y,z,w,h, colorArray, c)
						//TV GLUtils.addBufferedTriangle(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c], [d,d,d])
						GLUtils.addBufferedRect(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c])
					}
				}		
			}
			else
			{
				for(var i=0 ; i<numNodes ; i++){
					ni = thisNodes[i]
					x = - _matrixWidthHalf + CELL_SIZE/2 + i * CELL_SIZE
					//TV for(var j=i ; j<numNodes ; j++){
					for(var j=0 ; j<numNodes ; j++){	
						nj = thisNodes[j]
						v = 0;
						y = + _matrixWidthHalf - CELL_SIZE/2 - j * CELL_SIZE //- CELL_SIZE*(numNodes+1.5) //TV - CELL_SIZE*(numNodes+1.5) added to leave space for the user defined consensus matrix.
						if(this.coverMatrixMode == MODE_TREND){
							v = this.pileMatrices[this.pileMatrices.length-1].matrix[ni][nj] - this.pileMatrices[0].matrix[ni][nj]; 
							c = 1-Math.abs(v)
							var col
							if(v > 0){
								col = [c,c,1]
							}else{
								col = [1,c,c]                            
							}
							
						//TV     GLUtils.addBufferedRect(vertexPositions, x, y, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
							GLUtils.addBufferedRect(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
						}else
						if(this.coverMatrixMode == MODE_VARIABILITY){
							v = 0
							arr = []
							for(var t=1 ; t<this.pileMatrices.length ; t++){
								// v += Math.pow(this.pileMatrices[t].matrix[ni][nj] - this.pileMatrices[t-1].matrix[ni][nj],2); 
								arr.push(this.pileMatrices[t].matrix[ni][nj])
							}
							// v = Math.sqrt(v)
							// c = 1-Math.abs(v)                        
							v = ss.standard_deviation(arr)
							c = 1-Math.abs(cellValue(v))                        
						//TV     GLUtils.addBufferedRect(vertexPositions, x, y, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,1])
							GLUtils.addBufferedRect(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,1])
						}else
						if(this.coverMatrixMode == MODE_BARCHART){
							var d = CELL_SIZE / this.pileMatrices.length
							for(var t=0 ; t<this.pileMatrices.length ; t++){
								v = 1 - this.pileMatrices[t].matrix[ni][nj] 

								x = - _matrixWidthHalf + i * CELL_SIZE + (d*t) + d/2
								y = + _matrixWidthHalf - (j+.5) * CELL_SIZE 
								GLUtils.addBufferedRect(vertexPositions, x, y, 0, d, (1-v)*CELL_SIZE, vertexColors, [v,v,v])

								x = - _matrixWidthHalf + j * CELL_SIZE + (d*t) + d/2
								y = + _matrixWidthHalf - (i+.5) * CELL_SIZE 
								GLUtils.addBufferedRect(vertexPositions, x, y, 0, d, (1-v)*CELL_SIZE, vertexColors, [v,v,v])
							}
						}else
						if(this.coverMatrixMode == MODE_DIFFERENCE 
							&& piles.indexOf(this) > 0){
							v = this.globalMatrix[ni][nj] - piles[piles.indexOf(this)-1].globalMatrix[ni][nj]; 
							c = 1-Math.abs(v)
							var col
							if(v > 0){
								col = [c,c,1]
							}else{
								col = [1,c,c]                            
							}
							
						//TV     GLUtils.addBufferedRect(vertexPositions, x, y, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
							GLUtils.addBufferedRect(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, col)
						}else     
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
							for(var t=0 ; t<this.pileMatrices.length ; t++){
								v += this.pileMatrices[t].matrix[ni][nj]; 
							}
							v /= this.pileMatrices.length
							c = 1-Math.max(0,cellValue(v))
						   
						//TV     GLUtils.addBufferedRect(vertexPositions, x, y, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c])
							GLUtils.addBufferedRect(vertexPositions, -y, -x, 0, CELL_SIZE, CELL_SIZE, vertexColors, [c,c,c])
						}
					}
				} // TV endof for loop to all nodes in the pile execute it only if checkbox of edge filters is not checked?
			}
        } // TV endof not single matrix
       
		//TV SOSOSOSOS for correcting OUT/IN-DEGREE shown in piles!!!!!!!!!!!!!!----------------------------- DONE
        // UPDATE PREVIEWS
        var m
        var highlight
		
		//TV SKELETON MODE is ON/OFF 																	--- DONE ---
		if (document.getElementById("sk_id").checked)//TV (document.getElementById("cbox3").checked) // ON
		{
			//TV	for(var t=0 ; t<this.pileMatrices.length && this.pileMatrices.length > 1 ; t++){ //TV also show pile for a single matrix
			for(var t=0 ; t<this.pileMatrices.length && this.pileMatrices.length > 0 ; t++)
			{
				m = this.pileMatrices[t].matrix
				y = _matrixWidthHalf + (PREVIEW_SIZE*(t+1))

				// test if matrix is single, if so highlight its preview
				highlight = false

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
						v[j] = v[j] + m[thisNodes[i]][thisNodes[j]] + m[thisNodes[j]][thisNodes[i]];   
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
		}
		else // OFF
		{
			//TV	for(var t=0 ; t<this.pileMatrices.length && this.pileMatrices.length > 1 ; t++){ //TV also show pile for a single matrix
			for(var t=0 ; t<this.pileMatrices.length && this.pileMatrices.length > 0 ; t++)
			{
				m = this.pileMatrices[t].matrix
				y = _matrixWidthHalf + (PREVIEW_SIZE*(t+1))

				// test if matrix is single, if so highlight its preview
				highlight = false
				//TV if(this.pileMatrices[t] == this.singleMatrix)
				//TV    highlight = true

				/* TV repeated?
				for(var i=0; i<numNodes ; i++){
					v=0;
					ni = thisNodes[i]
					for(var j=0; j<numNodes ; j++){
						v+=m[ni][thisNodes[j]];   
					}  
					c = 1 - cellValue(v/numNodes)
					if(highlight){
						c -= (1 - c) * .7 
					}
					x = -_matrixWidthHalf + CELL_SIZE * i + CELL_SIZE/2
					if(PILING_DIRECTION == 'vertical'){
						GLUtils.addBufferedRect(vertexPositions,x, y, .5, CELL_SIZE, PREVIEW_SIZE, vertexColors, [1,1,1])
						GLUtils.addBufferedRect(vertexPositions,x, y, .5, CELL_SIZE, PREVIEW_SIZE-.3, vertexColors, [c,c,c])
					}else{
						GLUtils.addBufferedRect(vertexPositions,y, x, .5, PREVIEW_SIZE, CELL_SIZE, vertexColors, [1,1,1])
						GLUtils.addBufferedRect(vertexPositions,y, x, .5, PREVIEW_SIZE-.3, CELL_SIZE, vertexColors, [c,c,c])
					}
				}		
				*/

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
						v[j] = v[j] + m[thisNodes[i]][thisNodes[j]];   
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

				// TV add a red dot next to PREVIEW if matrix belongs to consensus pile.
				//var dotmesh
				/* MOVED further down after Mesh is defined.
				if ((this.pileMatrices[t].consensus) && (this.id != 0))
				{
					dotmesh = GLUtils.createDot(0xff0000) //(0x0080ff)
					dotmesh.position.set(x + this.x + CELL_SIZE, this.y + y,0)//(x*t,y,0) //(x + this.x,-y + this.y,0)
					//dotmesh.scale.set(1 / this.scale, 1 / this.scale, 1 / this.scale)
					scene.add(dotmesh);
				}
				else if (this.id != 0)
				{
					dotmesh = GLUtils.createDot(0xffffff)
					dotmesh.position.set(x + this.x + CELL_SIZE, this.y + y,0)
					//scene.remove(dotmesh);
					scene.add(dotmesh);
				}
				*/


				
				
				/* TV this loop calculates the piles value based on IN-DEGREE
				for(var i=0; i<numNodes ; i++){
					v=0;
					ni = thisNodes[i]
					for(var j=0; j<numNodes ; j++){
						v+=m[ni][thisNodes[j]];   
					}  
					c = 1 - cellValue(v/numNodes)
					if(highlight){
						c -= (1 - c) * .7 
					}
					x = -_matrixWidthHalf + CELL_SIZE * i + CELL_SIZE/2
					if(PILING_DIRECTION == 'vertical'){
						GLUtils.addBufferedRect(vertexPositions,x, y, .5, CELL_SIZE, PREVIEW_SIZE, vertexColors, [1,1,1])
						GLUtils.addBufferedRect(vertexPositions,x, y, .5, CELL_SIZE, PREVIEW_SIZE-.3, vertexColors, [c,c,c])
					}else{
						GLUtils.addBufferedRect(vertexPositions,y, x, .5, PREVIEW_SIZE, CELL_SIZE, vertexColors, [1,1,1])
						GLUtils.addBufferedRect(vertexPositions,y, x, .5, PREVIEW_SIZE-.3, CELL_SIZE, vertexColors, [c,c,c])
					}
				} */ //TV back-up of routine that shows IN-DEGREES in piles
				
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
/*TV       if(this == hoveredPile){ // && _pileToolsVisible){
            // visiblePileTools = []
            // var rows = []
            for(var i=pileTools.length-1 ;i>=0 ; i--){
                var pt = pileTools[i]
                pt.pile = this
                if(!pt.single && this.pileMatrices.length == 1)
                    continue
                // if(!rows[pt.row]){
                //     rows[pt.row] = 0
                // }
                // var c = rows[pt.row] 
                // rows[pt.row]++

                var o = GLUtils.createRect(pt.name.length * LETTER_SPACE, PILE_TOOL_SIZE, pt.color)
                // var o - this.geometry = new THREE.BufferGeometry();
                var f = GLUtils.createRectFrame(pt.name.length * LETTER_SPACE, PILE_TOOL_SIZE, 0x000000,5)
                o.add(f)
                var textGeom = new THREE.TextGeometry(pt.name, {
                        size: 8,
                        height: 1, 
                        curveSegments: 1,
                        font: 'helvetiker',
                    })
                var textMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
                var label = new THREE.Mesh(textGeom, textMaterial)
                o.position.set(
                    this.x - _matrixWidthHalf - pt.name.length * LETTER_SPACE/2, 
                    this.y + -2+_matrixWidthHalf - PILE_TOOL_SIZE/2 - (i * PILE_TOOL_SIZE), 
                    .8)
                label.position.set(-pt.name.length * LETTER_SPACE/2 +2, -4, 1)
                o.add(label)
                o.pileTool = pt
                o.scale.set(1 / this.scale, 1 / this.scale, .9)
                visiblePileTools.push(o)
                scene.add(o)     
            }
        } 
*/ //TV	disable hover over menu	
       
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
                    this.globalMatrix[i][j] += Math.abs(this.pileMatrices[t].matrix[i][j])
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
                    this.globalMatrix[i][j] += Math.abs(this.pileMatrices[t].matrix[i][j])
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

    Pile.prototype.updateCellSize = function () {
        this.matFrame = GLUtils.createRectFrame(_matrixWidth, _matrixWidth, 0xaaaaaa, .1)
		//TV console.log("zoom")
    }

	//TV TODO draw only black edges above the threshold value
	//Pile.prototype.filterEdges = function (p)
	//{
		//console.log(p)
	//	if(this.pileMatrices.length == 1)
	//	{
			//console.log("1")
	//	}
	//	else
	//	{
			//console.log(this.pileMatrices.length)
			//TV TODO here apply the filter
	//	}
	//}


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

