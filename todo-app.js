(() => {

  //создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  //создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let inputValue = input.value
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');
    button.disabled = true;
    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  //создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function createTodoItem(name) {
    let item = document.createElement('li');
    //кнопки помещаем в элемент, который красиво покажет их в ожной группе
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    let randomId = Math.random() * 50;
    item.id = randomId.toFixed(2)
    // устанавливаем стили для элемента списка, а такэе для размещения кнопок
    //в его правой части с помощью flex
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    //приложению нужен доступ к самому элементу и кнопкам чтобы обрабатывать события нажатия
    return {
      item,
      doneButton,
      deleteButton,
      buttonGroup
    }
  }

  function createTodoApp(container, title = 'Список дел', arrayX = [], key) {

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();

    let todoList = createTodoList();
    let todoItem = createTodoItem();
    let todoItemFormInput = todoItemForm.input
    let InputValue = todoItemFormInput.value

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);


    // Выгрузка дел из кода
    if (arrayX.length != 0) {
      for (i = 0; i < arrayX.length; i++) {
      let x = createTodoItem(arrayX[i].name);
      todoList.append(x.item);

      if (arrayX[i].done == true) {
        x.item.classList.toggle('list-group-item-success');
      }
      x.doneButton.addEventListener('click', function(){
        x.item.classList.toggle('list-group-item-success');
      });
      x.deleteButton.addEventListener('click', function(){
        if (confirm('Вы уверены?')) {
          x.item.remove();
        }
      });
    }};

    // LocalStorage
    if (localStorage.getItem(key)) {
      arrayX = JSON.parse(localStorage.getItem(key));
      for (let obj of arrayX) {
        let todoItem = createTodoItem(todoItemForm.input.value);

        todoItem.item.textContent = obj.name;
        todoItem.item.id = obj.id;

        if (obj.done === true) {
          todoItem.item.classList.add('list-group-item-success');
        } else {
          todoItem.item.classList.remove('list-group-item-success');
        }

        let functionClickDone = todoItem.doneButton.addEventListener('click', function(){
          arrayX = JSON.parse(localStorage.getItem(key));
          todoItem.item.classList.toggle('list-group-item-success')
          function changeItemDone(arr, item) {
            arr.map(obj => {
              if (obj.id === item.id & obj.done === false) {
                obj.done = true;
              } else if (obj.id === item.id & obj.done === true) {
                obj.done = false;
              };
            });
          };
          changeItemDone(arrayX, todoItem.item)

          let serialArrayDone = JSON.stringify(arrayX);
          localStorage.setItem(key, serialArrayDone)
        });

        let functionClickDelete = todoItem.deleteButton.addEventListener('click', function(){
          if (confirm('Вы уверены?')) {
            arrayX = JSON.parse(localStorage.getItem(key));
            console.log('ok')
            let newList = arrayX.filter(obj => obj.id !== todoItem.item.id)

            let serialArrayDelete = JSON.stringify(newList);
            localStorage.setItem(key, serialArrayDelete)

            todoItem.item.remove();
          }
        });

        todoList.append(todoItem.item)
        todoItem.item.append(todoItem.buttonGroup)
      };
    }

    // dutton dissabled
      let todoItemFormButton = todoItemForm.button

     function btnNotDisabled() {
      if (todoItemFormInput.value.length > 0) {
        todoItemFormButton.disabled = false;
      } else {
        todoItemFormButton.disabled = true;
      }
    }
    todoItemFormInput.addEventListener('input', btnNotDisabled)



    //браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
    todoItemForm.form.addEventListener('submit', function(e) {
      //эта строчка необходима, чтобы предотратить стандартное действие браузера
      //в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
      e.preventDefault();

      //игнорируем создание элемента, если пользователь ничего не ввел в поле
      if (!todoItemForm.input.value) {
        return
      }

      if (todoItemFormInput.value.length > 0) {
        todoItemFormButton.disabled = true;
      }

      let todoItem = createTodoItem(todoItemForm.input.value);
      let todoItemItem = todoItem.item
      let localStorageData = localStorage.getItem(key);



      // обработчики на кнопки
      let functionClickDone = todoItem.doneButton.addEventListener('click', function(){
        arrayX = JSON.parse(localStorage.getItem(key));
        todoItem.item.classList.toggle('list-group-item-success')
        function changeItemDone(arr, item) {
          arr.map(obj => {
            if (obj.id === item.id & obj.done === false) {
              obj.done = true;
            } else if (obj.id === item.id & obj.done === true) {
              obj.done = false;
            };
          });
        };
        changeItemDone(arrayX, todoItemItem)

        let serialArrayDone = JSON.stringify(arrayX);
        localStorage.setItem(key, serialArrayDone)
      });

      let functionClickDelete = todoItem.deleteButton.addEventListener('click', function(){
        if (confirm('Вы уверены?')) {
          arrayX = JSON.parse(localStorage.getItem(key));

          let newList = arrayX.filter(obj => obj.id !== todoItemItem.id)

          let serialArrayDelete = JSON.stringify(newList);
          localStorage.setItem(key, serialArrayDelete)

          todoItem.item.remove();
        }
      });

      //создаем и добавляем в список новое дело с названием из поля для ввода
      todoList.append(todoItem.item);

      if (localStorageData == null) {
        arrayX = []
      } else {
        arrayX = JSON.parse(localStorageData)
      }

      // LocalStorage
      function pushObjSubmit(arr) {
        let submitObg = {};
        submitObg.name =  todoItemForm.input.value;
        submitObg.id = todoItem.item.id;
        submitObg.done = false;
        arr.push(submitObg)
      };

      pushObjSubmit(arrayX);

      let serialArray = JSON.stringify(arrayX); //сериализуем массив
      localStorage.setItem(key, serialArray); //запишем его в хранилище по ключу "TODOKey"


      //обнуляем значение в поле, чтобы не пришлось стирать его вручную
      todoItemForm.input.value = '';
    });
    return
  }

  window.createTodoApp = createTodoApp;
})();
