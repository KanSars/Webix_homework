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
                        { view: 'text', name: 'fio', label: Locale.fio, labelWidth: 120 },
                        { view: 'text', name: 'email', label: Locale.email, labelWidth: 120 },
                        { view: 'text', name: 'phone', label: Locale.phone, labelWidth: 120 },
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
                    view: 'button', id: 'saveUpdateUserBtn', value: Locale.save,
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
                }
            ]
        },
    ]
}

const Controller = {

    elements: {},

    init() {
        this.initElements()
        this.initEvents()
    },

    initElements() {
        this.elements.userForm = $$('userForm')
        this.elements.addUserBtn = $$('addUserBtn')
        this.elements.deleteUserBtn = $$('deleteUserBtn')
        this.elements.usersTable = $$('usersTable')
    },

    initEvents() {
        this.elements.addUserBtn.attachEvent('onItemClick', () => {
            //TODO: подсказка при валидации https://ru.docs.webix.com/desktop__data_validation.html
            //this.elements.userForm.validate() ? Model.addItem(this.elements.userForm.getValues()) : null;
            console.log(this.elements);
            Model.addItem(this.elements.userForm.getValues());
        })
        /*
        this.elements.updateUserBtn.attachEvent('onItemClick', () => {
            //TODO: подсказка при валидации https://ru.docs.webix.com/desktop__data_validation.html
            //this.elements.userForm.validate() ? Model.addItem(this.elements.userForm.getValues()) : null;
            console.log('update!');
        })
        */
    },

    refreshTable(data) {
        this.elements.usersTable.clearAll();
        this.elements.usersTable.parse(data)
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

    addItem(item) {
        this.data.push(item)
        //console.log('adddata this.data=', this.data);
        Controller.refreshTable(this.data)
    },

    deleteItem(itemId) {
        console.log('itemId= ', itemId);
        console.log(this.data);

        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].id === itemId) {
                console.log(this.data[i].id, "===", itemId);
                console.log('this.data= ', this.data);
                this.data.splice(i, 1)
                console.log('this.data= ', this.data);
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
        });
    }
}

webix.ready(function () {
    webix.ui(UI)
    Controller.init()
})