
//Контроллер компоненты
function aceController($scope, $http) {
    editor = ace.edit(document.getElementById("editor"));    
    editor.getSession().setMode("ace/mode/javascript"); 

    $scope.Filename = 'aceComponent.js';
    
    $http.get($scope.Filename).then(successCallback, errorCallback);

    function successCallback(response){        
        editor.setValue(response.data)   
    }
    function errorCallback(error){
        alert("При загрузке файл произошла ошибка");
    }
    
    
    //Массив горячих ключей пользователя
    $scope.userHotKeys = [];
    
    //Массив сниппетов пользователя
    $scope.userSnippets = [];
    
    $scope.themeNameSelected = "cobalt";    
    
    //
    // Функции, описывающие действия для горячих клавиш
    //
    
    //Функция сохранения текста рекдактора в файл
    $scope.saveToFile = function() {            
        var textToSave = editor.getValue();
        var textToSaveAsBlob = new Blob([textToSave]);
        var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
        var fileNameToSaveAs = "savedFile.js";

        var downloadLink = document.createElement("a");
        downloadLink.download = fileNameToSaveAs;
        downloadLink.innerHTML = "Download File";
        downloadLink.href = textToSaveAsURL;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);

        downloadLink.click();
    };        
    
    //Открыть файл
    $scope.openFile = function (event) {                               
         document.getElementById('input-upload').click();     
    };
    
    //Увеличить шрифт
    $scope.increaseFontSize = function() { 
        var editorFontSize = getComputedStyle(document.getElementById('editor'), null).getPropertyValue("font-size");
        editorFontSize = editorFontSize.substr(0, editorFontSize.length-2);
        editorFontSize = +editorFontSize + 1;
        document.getElementById('editor').style.fontSize= editorFontSize + 'px';
    };
    
    //Уменьшить шрифт
    $scope.decreaseFontSize = function() {
        var editorFontSize = getComputedStyle(document.getElementById('editor'), null).getPropertyValue("font-size");
        editorFontSize = editorFontSize.substr(0, editorFontSize.length-2);
        editorFontSize -= 1;
        document.getElementById('editor').style.fontSize= editorFontSize + 'px';
    };
    
    //Установка режима "только чтение"
    $scope.setReadOnly = function() {
        editor.setReadOnly(true);
        console.log("Режим только чтение включен");
    };
    
    //Отключение режима "только чтение"
    $scope.unsetReadOnly = function() {
        editor.setReadOnly(false);
        console.log("Режим только чтение отключен");
    };
    
    $scope.execFunctions = [ {"name": 'увеличить шрифт', function: $scope.increaseFontSize, defaultKey: "alt+w"}, 
                             {"name": 'уменьшить шрифт', function: $scope.decreaseFontSize, defaultKey: "alt+q"},
                             {"name": 'откл. "только чтение"', function: $scope.unsetReadOnly, defaultKey: "alt+e"},
                             {"name": 'режим "только чтение"', function: $scope.setReadOnly, defaultKey: "alt+r"},
                             {"name": 'сохранить в файл', function: $scope.saveToFile, defaultKey: "ctrl+s"},
                             {"name": 'открыть файл', function: $scope.openFile, defaultKey: "ctrl+o"} ];
    
    
    //Функция для установки горячих клавиш
    $scope.setHotKey = function(hotKey, execFunction) {                      
        try {
            editor.commands.addCommand({
                name: execFunction.name,
                bindKey: {win: hotKey,  mac: hotKey},
                exec: execFunction.function,
                readOnly: true
            });
            
            var userHotKey = {}, changing = false;                        
            
            // Поиск и обновление существующего горячего ключа
            $scope.userHotKeys.forEach(function(item, i, userHotKeys) {
                    if (item.execFunction === execFunction)
                        {
                            item.hotKey = hotKey;
                            item.item = hotKey + " - " + execFunction.name;
                            changing = true;                            
                        }
                }                
            );
            
            if (!changing) {
                userHotKey.item = hotKey + " - " + execFunction.name;
                userHotKey.hotKey = hotKey;
                userHotKey.execFunction = execFunction;
                $scope.userHotKeys.push(userHotKey);                                                                  
            }                                        
            
             var message = 'На комбинацию "'+hotKey+'" успешно установлено действие "'+execFunction.name+'"';
                
                //alert(message);                 
                console.log(message);  
        }
        catch(e){
            //alert("Установка горячих клавишь не удалась!");
            console.log(e);
        }
    };
    
    $scope.execFunctions.forEach(function(item, i, execFunctions){
        $scope.setHotKey(item.defaultKey, item);
    });
       
    //Отображение меню горячих клавиш
    /*ace.config.loadModule("ace/ext/keybinding_menu", function(module) {
        module.init(editor);
        editor.showKeyboardShortcuts();
    });*/  
    
    //
    // Установка сниппетов
    //
    
    editor.setOptions({enableBasicAutocompletion: true,
                       enableSnippets: true});
    
    var snippetManager = ace.require("ace/snippets").snippetManager;
    var config = ace.require("ace/config");
    
    //Функция установки сниппетов
    $scope.setSnippet = function(userSnippet) {
        try {
            ace.config.loadModule("ace/snippets/javascript", function(m) {
                if (m) {
                  snippetManager.files.javascript = m;          
                  m.snippets = snippetManager.parseSnippetFile(m.snippetText);

                  m.snippets.push({
                    content: userSnippet.content, 
                    name: userSnippet.name,
                    tabTrigger: userSnippet.trigger
                  });
                  snippetManager.register(m.snippets, m.scope);
                }
            })
            alert("Установка сниппета "+'"'+userSnippet.name+'"' + " успешно произведена!");
        }
        catch(e){
            alert("При установке сниппета "+userSnippet.name + " произошла ошибка!");
        }
    };
    
    //Функция добавления сниппета
    $scope.addSnippet = function(userSnippets){
        var newUserSnippet = {name: "NewSnippet", trigger: "", content: ""};
        userSnippets.push(newUserSnippet);        
        $scope.userSnippet = newUserSnippet;
    }
    
        //Функция добавления сниппета
    $scope.removeSnippet = function(userSnippet){
        $scope.userSnippets.forEach( function(item, i, userSnippets) {
            if (item === userSnippet){
                userSnippets.splice(i,1);            
                if (userSnippets.length !== 0)
                    if (i !== 0)
                        $scope.userSnippet = $scope.userSnippets[i-1]
                    else
                        $scope.userSnippet = $scope.userSnippets[i]
            }                
        })
    }
      
};

//Компонент для Ace Editor
angular.module('aceApp').component('aceComponent', {
  templateUrl: 'aceComponent.html',
  controller: aceController,
  bindings: {
    themes: '='
  }
});

//Директива для чтения из файла
angular.module('aceApp').directive("fileread",function () {
    return function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {                               
                    var fileToLoad = changeEvent.target.files[0];
                    var fileReader = new FileReader();
                    fileReader.onload = function(fileLoadedEvent) {
                        try {
                            scope.$apply( function() {
                                editor.setValue(fileLoadedEvent.target.result); 
                            })
                        }   
                        catch (e) {
                            alert("Недопустимый формат файла!");    
                        }
                    };
                    fileReader.readAsText(fileToLoad);            
            });            
        }
});

//Директива для обновления темы
angular.module('aceApp').directive('changeTheme', function() {
   return function (scope, element, attr) {      
       scope.$watch(attr.ngModel, function(value) {
           if (value !== null)
               editor.setTheme("ace/theme/"+value);
       })       
    }
  }
);