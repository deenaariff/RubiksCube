var controllers = angular.module("Controllers", ["WebModules","GeneralModules"])

controllers.controller("MainCtrl", function($scope, SocketIO, cubeLogic) {

        console.log("Main Controller Loaded")

        // Set Modules
        var socket = SocketIO; // load socket io functionality

        // Initialize DOM elements

        $scope.selected = true;
        $scope.error; // Displays Erros
        $scope.logon = true; // Whether Signin Div Dispalys
        $scope.signin = true;  // Display Signin Form
        $scope.cuser = false // Display Create User Form
        $scope.moves = 0; // Number of Moves
        $scope.move = false; // Show Navigation Arrows
        $scope.won = false;
        $scope.time = 0;
        $scope.user = {}

        $scope.instantiation = false;
        $scope.data;

        $scope.login = function() {
            console.log("login attempt")
            var data = $scope.data.signin;
            console.log(data);
            $scope.error = ""
            $scope.user.email = data.u_email
            $scope.user.password = data.pass
            socket.emit("user:login", data);
        }

        $scope.createUser = function() {
            console.log("user created")
            var data = $scope.data.cuser;
            console.log($scope.data.cuser)
            $scope.error = ""
            $scope.user.email = data.u_email
            $scope.user.password = data.pass2
            if (data.pass1 === data.pass2)
                socket.emit("user:create", data);
            else {
                scope.error = "Passwords do not match"
            }
        }

        socket.on("err", function (data) {
          console.log("New Error" + data);
          $scope.error = data;
        });

        var curRow = 0;
        var curCol = 0;
        var curFace = 0;

        var tmp;

        $scope.setCurrent = function(face, row, col) {
            curRow = row;
            curCol = col;
            curFace = face;
            console.log("Clicked" + row + col + curFace )
            $scope.move = true;
        }

        // 6 3x3 Matrices to Represent Rubix Cube
        cube = {
        	"1": [["g","g","g"],["g","g","g"],["g","g","g"]],
        	"2": [["r","r","r"],["r","r","r"],["r","r","r"]],
        	"3": [["y","y","y"],["y","y","y"],["y","y","y"]],
        	"4": [["b","b","b"],["b","b","b"],["b","b","b"]],
        	"5": [["w","w","w"],["w","w","w"],["w","w","w"]],
        	"6": [["p","p","p"],["p","p","p"],["p","p","p"]],
        }

        $scope.cubeDOM = [cube["1"], cube["2"], cube["3"], cube["4"], cube["5"], cube["6"]] // Cube DOM Accessor

        // AUTH data used serverside
        $scope.data = {
            "signin": {
                "u_email": "",
                "pass": ""
            },
            "cuser": {
                "u_email": "",
                "pass": "",
                "pass1": "",
                "pass2": ""
            }
        }

        // Styling for Squares
        $scope.hexcodeMap = {
            "g": "green",
            "r": "red",
            "b": "blue",
            "y": "yellow",
            "w": "white",
            "p": "purple",
            "o": "orange"
        }

        function initCube() {}
        var sessionTime;

        socket.on("initCube", function(data) {
            indexArray = ["1","2","3","4","5","6"]
            console.log(data.state)
            for (var i = 0; i < indexArray.length; i++) {
              var face = cube[indexArray[i]]
              for (var j = 0; j < face.length; j++) {
                var row = face[j];
                for (var k = 0; k < row.length; k++)
                  cube[indexArray[i]][j][k] = data.state[indexArray[i]][j][k]
              }
            }
            if ($scope.instantiation === false) {
              $scope.moves = data.moves;
              $scope.time = data.time;
              sessionTime = new Date().getTime() / 1000;
              $scope.instantiation = true;
              $scope.signin = false;
              $scope.cuser = false;
            }
        });

        $scope.up = function () {
          console.log("UP:" + curRow + curCol)
          move(curRow, curCol, 0, 1)
        }
        $scope.down = function () {
          console.log("DOWN:" + curRow + curCol)
          move(curRow, curCol, 0, -1)
        }
        $scope.rght = function () {
          console.log("RIGHT:" + curRow + curCol)
          move(curRow, curCol, 1, 1)
        }
        $scope.lft = function () {
          console.log("LEFT:" + curRow + curCol)
          move(curRow, curCol, 1, -1)
        }

        function move(row, col, hv, dir) {
                if (hv === 0)
                    vMove(cube, curFace, col, dir);
                else
                    hMove(cube, curFace, row, dir);
                if ($scope.instantiation === true) {
                  $scope.moves = $scope.moves + 1;
                  checkWin();
               }
        }

        /* Logic for Rotating Cube*/
        // TODO: Abstract to Factory

        var paths = [
          // Path for Faces 1,4,6,2 w/ rotation adjustment
          {"1":4,"4":4,"6":4,"2":2},
          // Path for Faces 1,4,6,2 w/ rotation adjustment
          {"2":4,"3":4,"4":4,"5":4},
          // Path for Faces 1,4,6,2 w/ rotation adjustment
          {"1":4,"5":3,"6":2,"3":1}
        ];

        var pathSearch = [["1","4","6","2"],["2","3","4","5"],["1","5","6","3"]];

        // Assign Rotation Paths to Horizontal and Vertical Moves Per Face
        var hAdjacencyPath = {"1":2,"2":1,"3":1,"4":1,"5":1,"6":2}
        var vAdjacencyPath = {"1":0,"2":0,"3":2,"4":0,"5":2,"6":0}

        /* Perform #rotation left rotations*/
        function rotateMatrix (_id,rotation) {
          console.log(_id);
          console.log(rotation);
          for(var k = 0; k < (4-rotation); k++) {
            var test = [[],[],[]]
            for (var i = 0; i < cube[_id].length; i++) {
              for (var j = 0; j < cube[_id].length; j++) {
                test[i][j] = cube[_id][i][j];
              }
            }
            for (var i = 0; i < cube[_id].length; i++) {
               for (var j = 0; j < cube[_id].length; j++) {
                 cube[_id][i][j] = window.math.transpose(test)[i][j]
               }
            }
            tmp = cube[_id][2];
            cube[_id][2] = cube[_id][0];
            cube[_id][0] = tmp;
          }
        }

        /* Modulus Function*/
        function mod (n, m) {
          return ((n % m) + m) % m;
        }

        /* Perform Horizontal move Operation*/
        function hMove (cube,_id,row,dir,_buffer,iter,path) {
            var buf = [];
            var pathArray = []
            var rotations = paths[hAdjacencyPath[_id]][_id];
            if(!iter) {
              iter = 1;
              pathArray = pathSearch[hAdjacencyPath[_id]]
            }
            else {
              iter = iter + 1;
              pathArray = path;
              if (_id === "5")
                rotations = 3;
              else if (_id === "3")
                rotations = 1;
            }
            rotateMatrix(_id,rotations)
            for (var i = 0; i < cube[_id].length; i++)
                buf.push(cube[_id][row][i])
            if (_buffer) {
               for (var i = 0; i < cube[_id].length; i++)
                  cube[_id][row][i] = _buffer[i];
            }
            rotateMatrix(_id,-1*rotations)
            var index = mod((pathArray.indexOf(_id) + dir), 4);
                var new_id = pathArray[index];
                if (iter != 5)
                  hMove(cube,new_id,row,dir,buf,iter,pathArray)
                else {
                    var data = {}
                    data.state = cube;
                    data.user = $scope.user;
                    data.moves = $scope.moves;
                    data.time = (new Date().getTime() / 1000) - $scope.time;
                    socket.emit("cube:update", data)
                    $scope.move = false;
                }
        }

          /* Perform Vertical move Operation*/
        function vMove (cube,_id,col,dir,_buffer,iter,path) {
          var buf = [];
          var pathArray = []
          var rotations = paths[vAdjacencyPath[_id]][_id];
          if(!iter) {
            iter = 1;
            pathArray = pathSearch[vAdjacencyPath[_id]]
          }
          else {
            iter = iter + 1;
            pathArray = path;
            if (vAdjacencyPath[_id] === '')
              rotations = 0;
          }
          rotateMatrix(_id,rotations)
          for (var i = 0; i < cube[_id].length; i++)
              buf.push(cube[_id][i][col])
          if (_buffer) {
             for (var i = 0; i < cube[_id].length; i++)
                cube[_id][i][col] = _buffer[i];
          }
          rotateMatrix(_id,-1*rotations)
          var index = mod((pathArray.indexOf(_id) + dir), 4);
              var new_id = pathArray[index];
              if (iter != 5)
                vMove(cube,new_id,col,dir,buf,iter,pathArray)
              else {
                  var data = {}
                  data.state = cube;
                  data.user = $scope.user;
                  data.moves = $scope.moves;
                  data.time = (new Date().getTime() / 1000) - $scope.time;
                  socket.emit("cube:update", data)
                  $scope.move = false;
              }
        }

       function randomize (cube, degree) {
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

        function checkWin() {
            var flag = 1;
            var winState = {
            	"1": [["g","g","g"],["g","g","g"],["g","g","g"]],
            	"2": [["r","r","r"],["r","r","r"],["r","r","r"]],
            	"3": [["y","y","y"],["y","y","y"],["y","y","y"]],
            	"4": [["b","b","b"],["b","b","b"],["b","b","b"]],
            	"5": [["w","w","w"],["w","w","w"],["w","w","w"]],
            	"6": [["p","p","p"],["p","p","p"],["p","p","p"]],
            }
            for (var i = 0; i < 6; i++) {
              for (var j = 0; j < winState[i].length; j++) {
                for (var k = 0; k < winState[i][j]; k++) {
                    if(winState[i][j][k] === cube[i][j][k]) {
                      flag = 0;
                    }
                    else {
                      flag = 1;
                    }
                }
              }
            }
            if(flag === 0) {
                var data;
                data.email = $scope.email;
                data.time = (new Date().getTime() / 1000) - $scope.time;
                socket.emit('cube:solved', data)
            }
        }

        $scope.logout = function () {
          socket.emit("Disconnect","logout")
        }


});
