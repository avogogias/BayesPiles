var pileUtils = new PileUtils()

function PileUtils(){


	PileUtils.prototype.calculateClusterPiling = function(threshold, matrices, distanceMatrix){
    	var piling = [0]
		var pilecount = 1
		for(var i=1 ; i<matrices.length; i++){
			for(var j=i-1 ; j>= piling[pilecount-1] ;j--){
				// console.log(i, j, distanceMatrix[i][j], threshold)
				if(distanceMatrix[i][j] > threshold){
					piling[pilecount] = i; 
					pilecount++;
					break;
				}
			}
		}
		return piling
	}

	//TV here the distance matrix is calculated. TODO: update to consider whole matrix!
	PileUtils.prototype.calculateDistance = function(matrices, nodes){
		var dMat = []
		for(var i=0 ; i<matrices.length; i++){
			dMat[i] = [];		
			for(var j=0 ; j<matrices.length; j++){
				dMat[i][j] = -1;						
			}
		}

		//TV TODO calculate distance vector based on score differences if scoreBased
		var maxDist
		for(i=1 ; i<matrices.length; i++){
			for(j=i-1; j>=0; j--){
				d = this.distance(matrices, i, j, nodes, dMat);
				maxDistance = Math.max(maxDistance, d);
			}
		}
		
		return {
			distanceMatrix: dMat, 
			maxDistance: maxDistance
		}

	}

	//TV not tested if all matrix is considered to calculate distance..
	// TODO replace with diff between scores?
	PileUtils.prototype.distance = function(matrices, m1,m2, nodes, dMat){

		if(dMat[m1][m2] != -1){
			return dMat[m1][m1];
        }
        var d=0, 
        	a=0, 
        	b=0

		/* TV add case when Score-based piling is selected;
		console.log(pilingMethod)
		if (pilingMethod=='scoreBased')
		{
			d = m1.score - m2.score;
			console.log("distance: "+d);
			dMat[m1][m2] = d;
			dMat[m2][m1] = d;
			return d;			
		}	
		*/
			
        for(var i=0 ; i<nodes.length ; i++){
            a = nodes[i]
            //TV for(var j=i ; j<nodes.length ; j++){
			for(var j=0 ; j<nodes.length ; j++){	
                b = nodes[j]
				//console.log(matrices[m1][a].length);
				for(var ml=0 ; ml<matrices[m1][a].length ; ml++){
					d += Math.pow(matrices[m1][a][ml][b] - matrices[m2][a][ml][b], 2);
				}
            }
        }
        d = Math.sqrt(d);
        dMat[m1][m2] = d;
        dMat[m2][m1] = d;
        return d;
    }


}
