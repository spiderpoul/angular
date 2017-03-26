
angular.module('aceApp', []).controller('MainCtrl', function MainCtrl($scope,$http) {
    var ctrl = this;
    
    ctrl.themes = ["cobalt", "eclipse","github","ambiance",
                     "chaos","chrome","clouds","clouds_midnight",
                     "crimson_editor","dawn","dreamweaver","idle_fingers"]; 
    
});
