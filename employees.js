

angular.module("EmployeesApp", [])
.controller("EmployeesCtrl", function($scope, $http) {
    
    $scope.employeeId = 0;
    draggedEmployee = null;
    dragOverEmployee = null;
    draggingClass = "dragging";
        
    $scope.JSONFilename = 'employeesData.json';
    $http.get($scope.JSONFilename).success(function(data) {
        $scope.employees = data;
        setID($scope.employees);
    });
    
    setID = function(employees) {
        employees.forEach(function (item, i, empoyees) {
            item.id = $scope.employeeId++;                
            setID(item.children);
        });
    };
        
    
    $scope.addNewComp = function(EmployeeName) {
        if (EmployeeName == null) {
            EmployeeName = "NewComp";
        }
        var newEmployee = {
            "name": EmployeeName,
            "children": []    
	    };        
        newEmployee.id = $scope.employeeId++;
        $scope.employees.push(newEmployee);
    };
    
    $scope.add = function(parentEmployee) {
        var newEmployee = {
		"name": "New",
        "children": []    
	    };
        newEmployee.id = $scope.employeeId++;
        if (parentEmployee.children != null)
            parentEmployee.children.push(newEmployee);
        else {
            parentEmployee.children = [];
            parentEmployee.children.push(newEmployee);
        }
    };
    
    drop = function(parentEmployee, newEmployee) {                
        function findAndDrop(employees) {
            employees.forEach(function (item, i, employees) {
                if (item.id === parentEmployee.id) {
                    item.children.push(newEmployee);
                    return;
                }
                else
                    findAndDrop(item.children)                 
            });
        }
        findAndDrop($scope.employees);
    };
    
    $scope.edit = function(employee) {        
        $scope.editedEmployee =  employee;
    };
    
    $scope.remove = function(employee) {
        function findAndRemove(employees) {
            employees.forEach(function (item, i, employees) {
                if (item.id === employee.id) {
                    employees.splice(i, 1);
                    return;
                }
                else
                    findAndRemove(item.children)                 
            });
        }
        findAndRemove($scope.employees);        
    };
    
    removeById = function(employeeId) {
        function findAndRemove(employees) {
            employees.forEach(function (item, i, employees) {
                if (item.id === employeeId) {
                    employees.splice(i, 1);
                    return;
                }
                else
                    findAndRemove(item.children)                 
            });
        }
        findAndRemove($scope.employees);        
    };
    
       
    $scope.saveToJSONFile = function() {                  
            employeesData = JSON.stringify($scope.employees);
            var textToSave = employeesData;
            var textToSaveAsBlob = new Blob([textToSave]);
            var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
            var fileNameToSaveAs = "employeesData.json";

            var downloadLink = document.createElement("a");
            downloadLink.download = fileNameToSaveAs;
            downloadLink.innerHTML = "Download File";
            downloadLink.href = textToSaveAsURL;
            //downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);

            downloadLink.click();

        };
    
    addDragClass = function(id) {
            var LiId = "li" + id; 
            draggingEmp = document.getElementById(LiId);            
            draggingEmp.className += " "+draggingClass;        
        
        };
    
    removeDragClass = function(id) {
        var LiId = "li" + id; 
        draggingEmp = document.getElementById(LiId);            
        draggingEmp.className -= " "+draggingClass;        
    }
    
    //Функция, которая проверяет, находится ли перемещаемый элемент над своими детьми
    isDragOverChild = function(draggedEmployeeId, dragOverEmployeeId) {      
        var draggedEmployee;
        
         function findDraggedEmployee(Employees) {
            Employees.forEach(function (item, i, employees) {
                if (item.id === draggedEmployeeId) {
                    draggedEmployee = item.children;
                    return;
                }                                
                else
                    findDraggedEmployee(item.children)
            })
        };    
        findDraggedEmployee($scope.employees);
        isfindDragOverChild = false;
        function findDragOverChild(draggedEmployee){
            draggedEmployee.forEach(function (item, i, employees) {
            if (item.id === dragOverEmployeeId) {
                isfindDragOverChild = true;
                return;
            }                                
            else
                findDragOverChild(item.children)
        })    
        }
        findDragOverChild(draggedEmployee);        
        return isfindDragOverChild;
    }
    
})

//Директива для добавления элемента при нажатии Enter
.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {                
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
})

//Директива для чтения из файла
.directive("fileread",function () {
    return function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {                               
                    var fileToLoad = changeEvent.target.files[0];
                    var fileReader = new FileReader();
                    fileReader.onload = function(fileLoadedEvent) {
                        try {
                            scope.$apply( function() {
                                scope.employees = JSON.parse(fileLoadedEvent.target.result); 
                                setID(scope.employees);
                                console.log(scope.employees);
                            })
                        }   
                        catch (e) {
                            alert("Недопустимый формат файла!");    
                        }
                    };
                    fileReader.readAsText(fileToLoad);            
            });            
        }
})

//Директива для увеличения ширины input поля
.directive("autosize", function() {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            function autoresize(text){                
                if (text.length>23) {
                    element.css('width',text.length*9+'px')    
                } 
                else
                    element.css('width','200px')    
                return text;
            }
            ngModelCtrl.$parsers.push(autoresize)
        }
}
})

// Директива для Drag and drop
.directive("dragEmployee", function() {
    return {
        scope: {
            dragEmployee: '='
        },
        link: function (scope, element, attrs) {       
                var placeholder = angular.element("<li class='placeholder'>Поместить сюда</li>");         
                element.on('dragstart', function(event) {                    
                    draggedEmployee = scope.dragEmployee;                    
                    addDragClass(draggedEmployee.id);                
                    event.dataTransfer.setDragImage(element[0], 0, 0);
                });

                element.on('dragend', function(event) {               
                    placeholder.remove();
                    removeDragClass(attrs.id);                
                });

                element.on('dragover', function(event) { 
                    event.preventDefault();                
                    dragOverEmployee = scope.dragEmployee;                     
                    if (draggedEmployee.id != dragOverEmployee.id && !isDragOverChild(draggedEmployee.id, dragOverEmployee.id))
                        element.append(placeholder);                
                });

                element.on('dragleave', function(event){
                    placeholder.remove();
                    dragOverEmployee = null;
                });

                element.on('drop', function(event){
                    if (dragOverEmployee != null && draggedEmployee.id != dragOverEmployee.id &&!isDragOverChild(draggedEmployee.id, dragOverEmployee.id))
                        scope.$apply( function() {                           
                            removeById(draggedEmployee.id);
                            drop(dragOverEmployee, draggedEmployee);
                        });
                    placeholder.remove();                
                })
            }
    }
});



