var mod = angular.module('GeneralModules', [])

mod.service('cubeLogic', function() {

    console.log("Cube Logic Instantiated")

    return {
      hMove: function (cube,_id,row,dir,_buffer,iter,path) {
        moveHorizontal(cube,_id,row,dir,_buffer,iter,path)
      },
      vMove: function (cube,_id,col,dir,_buffer,iter,path) {
        moveVertical(cube,_id,col,dir,_buffer,iter,path)
      },
      randomize: function (cube, degree) {
        randomizeCube(cube, degree)
      }
    }

    var paths = [
      // Path for Faces 1,4,6,2 w/ rotation adjustment
      {'1':0,'4':0,'6':0,'2':2},
      // Path for Faces 1,4,6,2 w/ rotation adjustment
      {'2':0,'3':0,'4':0,'5':0},
      // Path for Faces 1,4,6,2 w/ rotation adjustment
      {'1':0,'5':-1,'6':2,'3':1}
    ];

    var pathSearch = [['1','4','6','2'],['2','3','4','5'],['1','5','6','3']];

    // Assign Rotation Paths to Horizontal and Vertical Moves Per Face
    var hAdjacencyPath = {'1':2,'2':1,'3':1,'4':1,'5':1,'6':2}
    var vAdjacencyPath = {'1':0,'2':0,'3':2,'4':0,'5':2,'6':0}

    var rotateMatrix = function (_matrix,rotation, callback) {
      callback(_matrix)
    }

    function mod (n, m) {
      return ((n % m) + m) % m;
    }

    var moveHorizontal = function (cube,_id,row,dir,_buffer,iter,path) {
        var buf = [];
        var pathArray = []
        if(!iter) {
          iter = 1;
          pathArray = pathSearch[hAdjacencyPath[_id]]
        }
        else {
          iter = iter + 1;
          pathArray = path;
        }
        var rotations = paths[hAdjacencyPath[_id]][_id];
        rotateMatrix(cube[_id], rotations, function(_matrix) {
            for (var i = 0; i < _matrix.length; i++)
              buf.push(_matrix[row][i])
            if (_buffer) {
              for (var i = 0; i < _matrix.length; i++)
                _matrix[row][i] = _buffer[i];
              rotateMatrix(_matrix, (-1*rotations), function(_matrix2) {
                cube[_id] = _matrix2;
              });
            }
            var index = mod((pathArray.indexOf(_id) + dir), 4);
            var new_id = pathArray[index];
            if (iter != 5)
              moveHorizontal(cube,new_id,row,dir,buf,iter,pathArray)
        });
    }

    var moveVertical = function (cube,_id,col,dir,_buffer,iter,path) {
      var buf = [];
      var pathArray = [];
      if(!iter) {
        iter = 1;
        pathArray = pathSearch[vAdjacencyPath[_id]];
      }
      else {
        iter = iter + 1;
        pathArray = path;
      }
      var rotations = paths[vAdjacencyPath[_id]][_id];
      rotateMatrix(cube[_id], rotations, function(_matrix) {
          for (var i = 0; i < _matrix.length; i++)
            buf.push(_matrix[i][col])
          if (_buffer) {
            for (var i = 0; i < _matrix.length; i++)
              _matrix[i][col] = _buffer[i];
            rotateMatrix(_matrix, (-1*rotations), function(_matrix2) {
              cube[_id] = _matrix2;
            });
          }
          var index = mod((pathArray.indexOf(_id) + dir), 4);
          var new_id = pathArray[index];
          if (iter != 5)
            moveVertical(cube, new_id,col,dir,buf,iter,pathArray)
      });
    }

   function randomizeCube (cube, degree) {
      var options = [moveHorizontal(),moveVertical()];
      for (var i = 0; i < degree; i++) {
        // Randomize option, id, row || col, direction
        var o = 0
        var i = 3
        var rc = 3
        var d = 3
        options[o](cube,i,rc,d);
      }
    }

});
