angular.module("cardpayApp",[])
.controller("cardpayController", function($scope){
    $scope.amountDisable = true; //кнопка ввода суммы неактивна
    $scope.selectedcrcy = "RUR"; //валюта по умолчанию
    $scope.crcy = "" //валюта, отображаемая на кнопке "Оплатить"
    $scope.submitWidth = 200; // Ширина кнопки "Оплатить"
})
//Директива для ввода имени держателя карты, позволяет вводить только латинские буквы и переводит в верхний регистр
.directive('inputLetters', function() {
   return {
    require: 'ngModel',
    link: function (scope, element, attr, ngModelCtrl) {
      function inputLetters(text) {
        var transformedInput = text.replace(/[^A-Za-z ]/g, '');  
        transformedInput = transformedInput.toUpperCase();  
        if(transformedInput !== text) {
            ngModelCtrl.$setViewValue(transformedInput);
            ngModelCtrl.$render()
        }
        return transformedInput
      }
      ngModelCtrl.$parsers.push(inputLetters)
    }
  }
})

//Директива для ввода номера карты, позволяет вводить только цифры
.directive('inputNumbers', function() {
  return {
    require: 'ngModel',
    link: function (scope, element, attr, ngModelCtrl) {
      function inputNumbers(text) {
        var transformedInput = text.replace(/[^0-9]/g, '');  
    
        var number1 = transformedInput.slice(0, 4),
            number2 = transformedInput.slice(4, 8),
            number3 = transformedInput.slice(8, 12),
            number4 = transformedInput.slice(12, 16);
        if (number2 !== "")  
            transformedInput = number1 + ' ' + number2;
        if (number3 !== "")  
            transformedInput = number1 + ' ' + number2 + ' ' + number3;
        if (number4 !== "")  
            transformedInput = number1 + ' ' + number2 + ' ' + number3 + ' ' + number4;
            
          
        if (transformedInput.slice(0,1) === "")  {
            scope.cardimage = "";
            scope.prompt = "";
        }            
        if (transformedInput.slice(0,1) === "3")
            scope.cardimage = "a-express";
        if (transformedInput.slice(0,1) === "4")
            scope.cardimage = "visa";
        if (transformedInput.slice(0,1) === "5")
            scope.cardimage = "mastercard";
        if (transformedInput.slice(0,1) === "6")
            scope.cardimage = "discover";  
        
        if (scope.cardimage === "a-express") 
            scope.prompt = "prompt-aexp";
        if (scope.cardimage === "visa" || scope.cardimage === "mastercard" || scope.cardimage === "discover") {
            scope.prompt = "prompt-visa";
        }            
         
        if(transformedInput !== text) {
            ngModelCtrl.$setViewValue(transformedInput);
            ngModelCtrl.$render()
        }
        return transformedInput;
      }
      ngModelCtrl.$parsers.push(inputNumbers)
    }
  }
})

//Директива для обновления текущей валюты на кнопке
.directive('inputCrcy', function() {
   return function (scope, element, attr) {      
       scope.$watch(attr.ngModel, function(value) {
            if (scope.card.amount !== "")
            scope.crcy = value;         
           }
        )       
    }
  }
)

//Директива для ввода суммы, позволяет вводить только цифры
.directive('inputAmount', function() {
  return {
    require: 'ngModel',
    link: function (scope, element, attr, ngModelCtrl) {
      function inputAmount(text) {
        var transformedInput = text.replace(/[^0-9]/g, '');
        if (transformedInput.length !== 0)  
            scope.crcy = scope.selectedcrcy;
        if (transformedInput.length === 0)  
            scope.crcy = "";
        if (transformedInput.length < 9)
            scope.submitWidth = 200;    
        if (transformedInput.length > 9 && transformedInput.length < 15)
            scope.submitWidth = 300;
        if (transformedInput.length > 15)
            scope.submitWidth = 400;  
        if(transformedInput !== text) {
            ngModelCtrl.$setViewValue(transformedInput);
            ngModelCtrl.$render()
        }
        return transformedInput
      }
      ngModelCtrl.$parsers.push(inputAmount)
    }
  }
})

//Директива для ввода секретного кода, позволяет вводить только цифры
.directive('inputSecure', function() {
  return {
    require: 'ngModel',
    link: function (scope, element, attr, ngModelCtrl) {
      function inputSecure(text) {
        var transformedInput = text.replace(/[^0-9]/g, '');
        var securelength = 4;   

        if (scope.cardimage === "a-express" && transformedInput !== "") 
            securelength = 4;
          
        if (scope.cardimage === "visa" || scope.cardimage === "mastercard" || scope.cardimage === "discover")   
            securelength = 3;
          
        if(transformedInput.length > securelength) 
            transformedInput = transformedInput.slice(0, securelength);
          
        if(transformedInput !== text) {
            ngModelCtrl.$setViewValue(transformedInput);
            ngModelCtrl.$render()
        }
        return transformedInput
      }
      ngModelCtrl.$parsers.push(inputSecure)
    }
  }
});
 