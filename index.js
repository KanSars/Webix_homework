//TODO: кнопку сохнарить активная/неактивная в зависимости от процесса редактирования

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
                    view: 'datatable',
                    id: 'usersTable',
                    columns: [
                        { id: 'fio', header: Locale.fio, width: 90 },
                        { id: 'email', header: Locale.email, width: 90 },
                        { id: 'phone', header: Locale.phone, width: 90 },
                        {
                            id: 'head', header: Locale.head, width: 90,
                            template: item => item.head ? 'Да' : 'Нет'
                        },
                        {
                            id: 'division', header: Locale.division, width: 90,
                            template: item => Controller.getDivisionById(+item.division)
                        },
                        {
                            view: 'button', id: 'deleteUser', header: Locale.delete, width: 100,

                            template: function (item) {
                                return '<button onclick=Model.deleteItem(' + item.id + ')>' + Locale.delete + '</button>'
                            }
                        },
                        {
                            view: 'button', id: 'updateUserBtn', header: Locale.update, width: 130,
                            template: function (item) {
                                return '<button onclick=Model.updateItem(' + item.id + ')>' + Locale.update + '</button>'
                            }
                        },
                    ]
                },
                {
                    rows: [
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
        this.elements.deleteUserBtn = $$('deleteUserBtn')
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

    data: [],

    isExists(item) {
        return this.data.find(dataItem => dataItem.phone == item.phone);
    },

    addItem(item) {
        if (!this.isExists(item)) {
            this.data.push(item)
            //console.log('adddata this.data=', this.data);
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
            }
        }
        Controller.refreshTable(this.data)
        console.log('this.data= ', this.data);
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

webix.ready(function () {
    webix.ui(UI)
    Controller.init()
})