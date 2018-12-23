/*
TV: this method calculates the summary top matrix which shows the OUT-DEGREE of each matrix in the data set.
The values found in a row are summed and the fraction with the number of cells is calculated to become the representative
weight of the row. When the contents of the cells only show presence("1") or absense("0") of an edge then the representative
weight is a value between 0 and 1.
*/
function Matrix(id, run_id, matrix, score, iteration) {

    var DIAGONAL_VALUE = 0;

    this.matrix = matrix;
    //TV numNodes = matrix.length
    //TV for (var i=0 ;i < numNodes ;i++) {
    //TV     for (var j=i; j < numNodes ;j++) {
    //TV         //TV this.matrix[i][j] = Math.max(0, this.matrix[i][j])
	//TV 		console.log("("+ i + "," + j + ") = " + this.matrix[i][j]);
    //TV         //TV this.matrix[j][i] = this.matrix[i][j] // TV: commenting this line corrects the summary col of matrix OUT-DEGREE in top view only
    //TV     }
    //TV }
        
	//TV property true if matrix added in consensus pile	
	this.consensus = false;	
		
    this.pile;

    this.id = id;
	
	this.run_id = run_id;

	//TV
	//console.log(matrix.length);
	
	//TV: every matrix now also has a score and iteration attribute
	this.score = score;
	this.iteration = iteration;
	//console.log(score);
	
    // GLOBAL VARS
    this.nodeValues = new Array(matrix.length);
	
	//TV SKELETON mode node values 
	this.nodeSkeletonValues = new Array(matrix.length);
	
    /* TV: this calculates the IN-DEGREE of each node (row). 
	var v 
    for(var i=0 ; i<matrix.length; i++){
        v = 0
        for(var j=0 ; j<matrix[i].length; j++){
          v += matrix[i][j] 
        }    
        this.nodeValues[i] = v/matrix.length //TV the fraction between number of "1" in a row and the size of the row, becomes the value of the summary col cell which gets darker the closest this is to "1".
    } 
	VT */
	// TV: instead this calculates the OUT-DEGREE of each node (column).
	// TV initialize the nodeValues to all zero:
    for(var i=0 ; i<matrix.length; i++){
			this.nodeValues[i] = 0;
			this.nodeSkeletonValues[i] = 0;
	}
    for(var i=0 ; i<matrix.length; i++){
        for(var j=0 ; j<matrix[i][0].length; j++){
			for (var ml=0; ml<matrix[0].length; ml++){
				if (i!=j)
				{
					this.nodeValues[j] = this.nodeValues[j] + matrix[i][ml][j]/(matrix.length-1);
					this.nodeSkeletonValues[j] = this.nodeSkeletonValues[j] + matrix[i][ml][j]/(matrix.length-1) + matrix[j][ml][i]/(matrix.length-1); 
					//console.log(this.nodeValues[j]);
				}				
			}
        }    
    }

    this.color = "#aaa" // annotation color of matrix

    Matrix.prototype.getConnectionValue = function (source, target) {
        var value = this.matrix[this.currentNodeOrder.index(source)][this.currentNodeOrder.index(target)];
        return value;
    }
	
	//TV Each matrix has a inConsensus status (true/false). Each pile also has a inConsensus status which depends on the matrices it contains. If at least one is inConsensus then the whole pile is inConsensus.
    Matrix.prototype.getConsensus = function () {
		//console.log("Get consensus = " + this.consensus);		
		return this.consensus;
    }
    Matrix.prototype.setConsensus = function (_consensus) {
		this.consensus = _consensus;
		console.log("Set consensus = " + this.consensus);
    }	
	
}
    

