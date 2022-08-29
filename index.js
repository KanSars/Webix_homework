//TODO: кнопку сохнарить активная/неактивная в зависимости от процесса редактирования
//получить значение чекбокса
//попробовать раскидать по файлам

const Locale = {
    addUser: 'Добавить пользователя',
    addedUsers: 'Добавленные пользователи',
    fio: 'ФИО',
    email: 'Email',
    phone: 'Телефон',
    head: 'Руководитель',
    division: 'Отдел',
    divisions: [
        { id: 1, value: 'Аналитики' },
        { id: 2, value: 'Разработки' },
        { id: 3, value: 'Коммерции' },
        { id: 4, value: 'Эксплуатации' },
    ],
    add: 'Добавить',
    delete: 'Удалить',
    update: 'Редактировать',
    save: 'Сохранить',
}

const UI = {
    view: 'layout',
    cols: [
        {
            width: 500,
            rows: [
                { view: 'template', type: 'header', template: Locale.addUser },
                {
                    view: 'form',
                    id: 'userForm',
                    elements: [
                        { view: 'text', name: 'fio', label: Locale.fio, invalidMessage: "Username can not be empty", labelWidth: 120 },
                        { view: 'text', name: 'email', label: Locale.email, invalidMessage: "Empty or incorrect email", labelWidth: 120 },
                        { view: 'text', name: 'phone', label: Locale.phone, invalidMessage: "Empty or incorrect phone", labelWidth: 120 },
                        {
                            view: 'checkbox', name: 'head', label: Locale.head, value: 1,
                            labelWidth: 120
                        },
                        {
                            view: 'richselect', name: 'division', label: Locale.division,
                            value: 1, options: Locale.divisions, labelWidth: 120
                        },
                    ],
                    rules: {
                        fio: webix.rules.isNotEmpty,
                        email: webix.rules.isEmail,
                        phone: webix.rules.isNumber
                    }
                },
                {
                    view: 'button', id: 'addUserBtn', value: Locale.add,
                    css: 'webix_primary'
                },
                {
                    view: 'button', id: 'saveUserBtn', value: Locale.save,
                    css: 'webix_primary'
                },

            ],
        },
        {
            rows: [
                { view: 'template', type: 'header', template: Locale.addedUsers },
                {
                    //onContext: {},
                    view: 'datatable',
                    id: 'usersTable',
                    columns: [
                        { id: 'fio', header: Locale.fio, width: 90 },
                        { id: 'email', header: Locale.email, width: 90 },
                        { id: 'phone', header: Locale.phone, width: 90 },
                        {
                            id: 'head', header: Locale.head, width: 120,
                            template: item => item.head ? 'Да' : 'Нет'
                        },
                        {
                            id: 'division', header: Locale.division, width: 90,
                            template: item => Controller.getDivisionById(+item.division)
                        },
                        { header: "", width: 110, css: "webix_primary", template: "<button class='webix_button book'>" + Locale.delete + "</button>" },

                        {

                            //Для варианта кнопки удаления определенного пользователя
                            /*
                            template: function (item) {
                                return '<button onclick=Model.deleteItem(' + item.id + ')>' + Locale.delete + '</button>'
                            }
                            */

                            view: 'checkbox', name: 'isForDelete',
                            labelWidth: 120,

                            template: function (item) {
                                return '<input onchange=Model.checkForDelete(' + item.id + ') type="checkbox">'
                                //return '<input onchange=checkItem(' + item.id + ') type="checkbox">'

                            }
                        },
                        {
                            view: 'button', id: 'updateUserBtn', header: Locale.update, width: 130,
                            template: function (item) {
                                return '<button onclick=Model.updateItem(' + item.id + ')>' + Locale.update + '</button>'
                            }
                        },
                    ],
                    onClick: {
                        "webix_button": function (e, id) {
                            console.log('id= ', id);
                            Model.deleteItem(id.row);
                        }
                    },
                },
                {
                    rows: [
                        {
                            view: 'button', id: 'deleteUsersBtn', value: Locale.delete,
                            css: 'webix_primary'
                        },
                        //{ view: 'text', name: 'find', label: Locale.phone, labelWidth: 120, },
                        //{ view: 'text', name: 'find', label: Locale.phone, labelWidth: 120, },
                        {
                            view: "search",
                            placeholder: "Search..",
                            id: 'searchForm',
                        },
                        {
                            id: 'userTable',
                            columns: [
                                { id: 'fio', width: 90 },
                                { id: 'email', width: 90 },
                                { id: 'phone', width: 90 },
                                {
                                    id: 'head', width: 90,
                                    template: item => item.head ? 'Да' : 'Нет'
                                },
                                {
                                    id: 'division', width: 90,
                                    template: item => Controller.getDivisionById(+item.division)
                                },
                            ]
                        },
                        {
                            id: "areaA",
                            template: "aasdasd",

                        },
                    ],
                },
            ]
        },
    ]

}

const Controller = {

    elements: {},
    user: {},

    init() {
        this.initElements()
        this.initEvents()
    },

    initElements() {
        this.elements.userForm = $$('userForm')
        this.elements.addUserBtn = $$('addUserBtn')
        this.elements.deleteUsersBtn = $$('deleteUsersBtn')
        this.elements.deleteUserContextBtn = $$('deleteUserContextBtn')
        this.elements.saveUserBtn = $$('saveUserBtn')
        this.elements.usersTable = $$('usersTable')
        this.elements.userTable = $$('userTable')
        this.elements.searchForm = $$('searchForm')

    },

    initEvents() {
        this.elements.addUserBtn.attachEvent('onItemClick', () => {
            //TODO: подсказка при валидации https://ru.docs.webix.com/desktop__data_validation.html
            //this.elements.userForm.validate() ? Model.addItem(this.elements.userForm.getValues()) : null;
            //console.log(this.elements); 
            Model.addItem(this.elements.userForm.getValues());
        })

        this.elements.saveUserBtn.attachEvent('onItemClick', () => {
            //TODO: подсказка при валидации https://ru.docs.webix.com/desktop__data_validation.html
            //this.elements.userForm.validate() ? Model.addItem(this.elements.userForm.getValues()) : null;
            console.log('update!');

            Model.saveItem(this.elements.userForm.getValues());
        })

        this.elements.deleteUsersBtn.attachEvent('onItemClick', () => {
            Model.deleteItems();
        })

        this.elements.deleteUserContextBtn.attachEvent('onItemClick', () => {
            Model.deleteItem();
        })


        this.elements.searchForm.attachEvent('onEnter', () => {
            console.log('search');
            console.log('this.elements.searchForm= ', this.elements.searchForm.getValue());
            Model.searchItem(this.elements.searchForm.getValue());
        })
    },

    refreshTable(data) {
        this.elements.usersTable.clearAll();
        this.elements.usersTable.parse(data)
        this.elements.userForm.clear();
    },

    refreshUserTable(user) {
        if (user) {
            console.log('refreshUserTable');
            this.elements.userTable.parse(user);
            //this.elements.userTable.clear();
            //this.elements.userTable.parse(user)
        } else {
            console.log('ytn nfrb[');
            'null'
        }
    },

    getDivisionById(id) {
        for (let division of Locale.divisions) {
            if (division.id === id) {
                return division.value
            }
        }
    },

}

const Model = {

    user: {
        division: 1,
        email: 'asd@mail.ru',
        fia: 'tarakan',
        head: 1,
        id: 12312312323,
        phone: 79171232323
    },

    data: [{
        division: 1,
        email: 'asd@mail.ru',
        fia: 'tarakan',
        head: 1,
        id: 123123123323,
        phone: 791712332323
    }],

    isExists(item) {
        return this.data.find(dataItem => dataItem.phone == item.phone);
    },

    addItem(item) {
        if (!this.isExists(item)) {
            this.data.push(item)
            console.log('adddata this.data=', this.data);
            Controller.refreshTable(this.data)
        }
    },

    searchItem(text) {
        //TODO: дополнить списком подходящих пользователей (а не первого подходящего)
        const user = this.data.find(item => item.fio == text) || this.data.find(item => item.email == text) || this.data.find(item => item.phone == text);
        console.log('user= ', user);
        Controller.refreshUserTable(user);
    },


    saveItem(item) {
        //let user = this.data.find(item => item.id == itemId);

        console.log('data= ', this.data);
        console.log('item= ', item);
        const itemId = item.id;

        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].id === itemId) {
                console.log(this.data[i].id, "===", itemId);
                this.data.splice(i, 1, item)
            } else {
                console.log(this.data[i].id, "!", itemId);
            }
        }

        Controller.refreshTable(this.data)
    },

    deleteItem(itemId) {
        console.log('itemId= ', itemId);
        console.log(this.data);

        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].id === itemId) {
                console.log(this.data[i].id, "===", itemId);
                this.data.splice(i, 1)
            } else {
                console.log(this.data[i].id, "===", itemId);
            }
        }
        Controller.refreshTable(this.data)
        console.log('this.data= ', this.data);
    },

    deleteItems() {
        // простая инициализация
        webix.confirm("Подтвердите, пожалуйста, удаление")
            .then(() => {
                for (let i = 0; i < this.data.length; i++) {
                    if (this.data[i].isForDelete) {
                        this.data.splice(i, 1)
                    }
                }
                Controller.refreshTable(this.data)
                console.log('deleteItemS(): this.data= ', this.data);
            })
    },

    checkForDelete(itemId) {
        console.log('itemId= ', itemId);
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].id === itemId) {
                !this.data[i].isForDelete ? this.data[i].isForDelete = true : this.data[i].isForDelete = !this.data[i].isForDelete;
            }
        }
    },


    updateItem(itemId) {
        let user = this.data.find(item => item.id == itemId);
        console.log('user= ', user);
        $$("userForm").setValues({
            fio: user.fio,
            email: user.email,
            phone: user.phone,
            head: user.head,
            division: user.division,
            id: user.id,
        });
    }
}
/*
webix.ready(function () {
    webix.ui(UI)
    webix.ui({
        view: "contextmenu",
        data: [
            "More info", "Edit", "Delete record",
            '<button onclick=Model.deleteItem()>' + Locale.delete + '</button>'
        ],

        on: {
            onItemClick: function (id) {
                var context = this.getContext();
                var list = context.obj;
                var listId = context.id;
                console.log("List item: <i>" + context + "</i> <br/>Context menu item: <i>" + this.getItem(id).value + "</i>");
                console.log(context);
            }
        }
*/
/*
click: (id) => {
    //webix.message('id= ', id);
    console.log('id= ', id);
    //console.log('item= ', item);
}
*/
/*
    }).attachTo($$("usersTable"));

    Controller.init()
})
*/

webix.ready(function () {
    webix.ui(UI)
    webix.ui({
        view: "contextmenu",
        data: ["Удалить", "Редактировать"],
        click: function (id, context) {
            switch (id) {
                case "Удалить":
                    console.log('TRY TO DELETE');
                    Model.deleteItem(this.getContext().id.row);
                    break;

                default:
                    break;
            }
            console.log(id + " on row " + this.getContext().id);
            console.log(id + " on row " + this.getContext().id.row);
            console.log(this.getContext().id.row === this.getContext().id);
            console.log(this.getContext().id);
            console.log(this.getContext().id.row);
            //console.log('context= ', context);
        }

    }).attachTo($$("usersTable"));

    Controller.init()
})


/*
template: function (item) {
    return '<button onclick=Model.deleteItem(' + item.id + ')>' + Locale.delete + '</button>'
}
*/
/*
webix.ui({
    view: "contextmenu",
    id: "cmenu",
    data: ["Add", "Rename", "Delete", { $template: "Separator" }, "Info"],
    on: {
        onItemClick: function (id) {
            var context = this.getContext();
            var list = context.obj;
            var listId = context.id;
            webix.message("List item: <i>" + list.getItem(listId).title + "</i> <br/>Context menu item: <i>" + this.getItem(id).value + "</i>");
        }
    }
});

$$("cmenu").attachTo($$("$list1"));
*/