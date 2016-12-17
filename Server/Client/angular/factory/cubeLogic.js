var mod = angular.module('GeneralModules', [])

mod.factory('cubeLogic', function() {

    var scope;

    var factData = {
      data: 1,
      initScope: function (sc) {
        scope = sc
      },
      add: function () {
        factData.data = factData.data + 1;
        console.log("Add Called")
      }
    }

    return {
      f_data: factData
    }

});
