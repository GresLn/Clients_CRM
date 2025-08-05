const SERVER_URL = "http://localhost:3000";

// Добавление данных клиента на сервер
async function serverAddClients(obj) {
  let response = await fetch(SERVER_URL + "/api/clients", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(obj),
  });

  let dataClient = await response.json();

  return dataClient;
}

// Получение списка клиентов с сервера
async function serverGetClients() {
  let responseList = await fetch(SERVER_URL + "/api/clients", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });

  let dataListClient = await responseList.json();

  return dataListClient;
}

// Изменение данных клиента
async function serverEditClients(obj, id) {
  let responseList = await fetch(SERVER_URL + "/api/clients/" + id, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(obj),
  });

  let dataEditClient = await responseList.json();

  return dataEditClient;
}

// Удаление клиента
async function serverDeleteClient(id) {
  let response = await fetch(SERVER_URL + '/api/clients/' + id, {
    method: 'DELETE',
  })

  let dataDelete = await response.json();

  return dataDelete;
}

// Поиск клиента
async function serverSearchClient(search) {
  let responseList = await fetch(SERVER_URL + "/api/clients" + "?" + "search=" + search, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });

  let dataListClientSearch = await responseList.json();

  return dataListClientSearch;
}

let clientsList = [];

// Общая ф-ия сортировки
function sortClients(arr, prop, dir = false) {
  let result = arr.sort(function (a, b) {
    let dirWay = a[prop] < b[prop];
    if (dir === true) dirWay = a[prop] > b[prop];
    if (dirWay === true) return -1;
  });
  return result;
}

// Получение списка клиентов от сервера и присвоение в clientsList
async function updateСlientsListFromServer() {
  // tableOverlay.classList.remove('main__table-overlay_hidden');
  let serverDataClients = await serverGetClients();
  if (serverDataClients) {
    sortClients(serverDataClients, 'id', dir = true)
    clientsList = serverDataClients;
  }
  // tableOverlay.classList.add('main__table-overlay_hidden');
}

// Тултипы
tippy("[data-tippy-content]");

// Подключение Choices
const multiSelect = () => {
  const elements = document.querySelectorAll(".modal__contact-select");
  elements.forEach((element) => {
    if (!element.hasAttribute("data-choice")) {
      const choices = new Choices(element, {
        searchEnabled: false,
        itemSelectText: "",
        shouldSort: false,
      });
    }
  });
};

// Очистка модального окна от блока контактов
function cleaningModalFromContacts(modalContainerClass, ContactsContainerClass) {
  const modalContainer = document.getElementById(modalContainerClass);
  const ContactsContainer = document.querySelector(ContactsContainerClass);
  modalContainer.innerHTML = "";
  modalContainer.classList.remove("modal__contact-wrap-add");
  ContactsContainer.classList.remove("modal__new-add-contact-wrap_pb");
}


// Очистка полей ввода в модальном окне
function cleaningInputModal() {
  document.getElementById('new-name').value = '';
  document.getElementById('new-surname').value = '';
  document.getElementById('new-lastname').value = '';
}

// Открыть модальное окно создания клиента
document.getElementById("main__btn-add-client").addEventListener("click", function () {
  cleaningModalFromContacts('contact-wrap', '.modal__new-add-contact-wrap');
  cleaningInputModal();
  document.getElementById("modal__new").classList.add("modal-visible");
  let btnAddNewContact = document.getElementById("new-add-contact");
  btnAddNewContact.disabled = false;
});

// Функция (общая) закрытия модального окна
function closeModal(idClosingCross, idClosingBtn, idModal, idModalBlock, cleaning = false, cleaningChange = false) {
  // закрытие по крестику
  document.getElementById(idClosingCross).addEventListener("click", function () {
    document.getElementById(idModal).classList.remove('modal-visible');
    setTimeout(() => {
      if (cleaning) {
        cleaningModalFromContacts('contact-wrap', '.modal__new-add-contact-wrap');
        cleaningInputModal();
      }
      if (cleaningChange) {
        cleaningModalFromContacts('change-contact-wrap', '.modal__change-add-contact-wrap');
        // cleaningInputModal();
      };
    }, 300)

  });
  // Закрытие по кнопке отмена
  if (idClosingBtn) {
    document.getElementById(idClosingBtn).addEventListener('click', () => {
      document.getElementById(idModal).classList.remove("modal-visible");
      setTimeout(() => {
        if (cleaning) {
          cleaningModalFromContacts('contact-wrap', '.modal__new-add-contact-wrap');
          cleaningInputModal();
        }
        if (cleaningChange) {
          cleaningModalFromContacts('change-contact-wrap', '.modal__change-add-contact-wrap');
          // cleaningInputModal();
        }
      })
    }, 300)
  }
  // Закрытие по Esc
  // window.addEventListener("keydown", (e) => {
  //   if (e.key === "Escape") {
  //     if (cleaning = true) {
  //       cleaningModalFromContacts('contact-wrap', '.modal__new-add-contact-wrap');
  //       cleaningInputModal();
  //     }
  //     document.getElementById(idModal).classList.remove("modal-visible");
  //   }
  // });

  // Закрытие при клике вне его
  document
    .getElementById(idModalBlock)
    .addEventListener("click", (event) => {
      event._isClickWithInModal = true;
    });
  document.getElementById(idModal).addEventListener("click", (event) => {
    if (event._isClickWithInModal) return;
    event.currentTarget.classList.remove("modal-visible");
    setTimeout(() => {
      if (cleaning) {
        cleaningModalFromContacts('contact-wrap', '.modal__new-add-contact-wrap');
        cleaningInputModal();
      }
      if (cleaningChange) {
        cleaningModalFromContacts('change-contact-wrap', '.modal__change-add-contact-wrap');
        // cleaningInputModal();
      }
    }, 300);
  });
}

// Закрытие модального окна создания клиента
closeModal('cross-btn', 'modal-new-esc', 'modal__new', 'modal-new-client', cleaning = true, cleaningChange = false);

// Закрытие модального окна изменения клиента
closeModal('cross-btn-change', '', 'modal__change', 'modal-change-client', cleaning = false, cleaningChange = true);

// Закрытие модального окна удаления клиента
closeModal('cross-btn-delete', 'delete-esc', 'modal-delete', 'modal-client-delete');

// Полные ФИО
function getFullName(clientsObj) {
  return clientsObj.surname + " " + clientsObj.name + " " + clientsObj.lastName;
}

// Формат даты создания
function getCreatedDayFormat(clientObj) {
  let dateFormat = new Date(clientObj.createdAt);
  let dayFormat = dateFormat.toLocaleDateString();
  return dayFormat;
}

// Формат даты изменения
function getUpdatedDayFormat(clientObj) {
  let dateFormat = new Date(clientObj.updatedAt);
  let dayFormat = dateFormat.toLocaleDateString();
  return dayFormat;
}

// Формат времени создания
function getCreatedTimeFormat(clientObj) {
  let createdDateFormat = new Date(clientObj.createdAt);
  let createdHoursFormat = createdDateFormat.getHours();
  let createdMinutesFormat = createdDateFormat.getMinutes();
  createdHoursFormat < 10 ? (HoursNull = "0") : (HoursNull = "");
  createdMinutesFormat < 10 ? (MinutesNull = "0") : (MinutesNull = "");
  let createdTimeFormat =
    HoursNull + createdHoursFormat + ":" + MinutesNull + createdMinutesFormat;
  return createdTimeFormat;
}

// Формат времени изменения
function getUpdatedTimeFormat(clientObj) {
  let updatedDateFormat = new Date(clientObj.updatedAt);
  let updatedHoursFormat = updatedDateFormat.getHours();
  let updatedMinutesFormat = updatedDateFormat.getMinutes();
  updatedHoursFormat < 10 ? (HoursNull = "0") : (HoursNull = "");
  updatedMinutesFormat < 10 ? (MinutesNull = "0") : (MinutesNull = "");
  let updatedTimeFormat =
    HoursNull + updatedHoursFormat + ":" + MinutesNull + updatedMinutesFormat;
  return updatedTimeFormat;
}

// Всплытие Placeholder в инпутах модального окна
let inputForm = document.querySelectorAll('.modal__new-input');
inputForm.forEach((input) => {
  let plhForm = input.nextElementSibling;
  input.addEventListener('input', () => {
    if (input.value) {
      plhForm.classList.add('modal__plch-top');
    } else {
      plhForm.classList.remove('modal__plch-top');
    }
  })
})

// Создание блока нового контакта клиента в модальном окне
function createNewContact(idContactWrap, idBtnDeleteContact, wrapperNewContacClass) {
  let wrapperContactBlock = document.getElementById(idContactWrap);

  let wrapperNewContac = document.createElement("div");
  let selectTypeContact = document.createElement("select");
  let optionsTel = document.createElement("option");
  let optionsEmail = document.createElement("option");
  let optionsFB = document.createElement("option");
  let optionsVK = document.createElement("option");
  let optionsOther = document.createElement("option");
  let inputContactWrap = document.createElement("div");
  let inputContact = document.createElement("input");

  let btnDeleteWrap = document.createElement("div");
  let btnDeleteContact = document.createElement("button");

  function btnDeleteContactSvg() {
    let svgDeleteContac = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgDeleteContac.classList.add("modal__new-contact-del-svg");
    svgDeleteContac.setAttribute("viewBox", "0 0 12 12");
    svgDeleteContac.setAttribute("width", "12");
    svgDeleteContac.setAttribute("height", "12");
    svgDeleteContac.setAttribute("fill", "none");
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z"
    );
    path.setAttribute("fill", "#B0B0B0");
    svgDeleteContac.append(path);

    return svgDeleteContac;
  }

  function btnDeleteContactSvgHover() {
    let btnDeleteContactSvgHover = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    btnDeleteContactSvgHover.classList.add("modal__new-contact-del-svg-hover");
    btnDeleteContactSvgHover.setAttribute("viewBox", "0 0 12 12");
    btnDeleteContactSvgHover.setAttribute("width", "12");
    btnDeleteContactSvgHover.setAttribute("height", "12");
    btnDeleteContactSvgHover.setAttribute("fill", "none");
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z"
    );
    path.setAttribute("fill", "#F06A4D");
    btnDeleteContactSvgHover.append(path);

    return btnDeleteContactSvgHover;
  }

  selectTypeContact.setAttribute("name", "contact");
  inputContact.setAttribute("type", "text");
  btnDeleteContact.setAttribute("type", "button");
  btnDeleteContact.setAttribute("id", idBtnDeleteContact);

  wrapperContactBlock.classList.add("modal__contact-wrap-add");
  wrapperNewContac.classList.add(wrapperNewContacClass);
  selectTypeContact.classList.add("modal__contact-select");
  inputContactWrap.classList.add('modal__contact-input-wrap')
  inputContact.classList.add("modal__contact-input");
  btnDeleteWrap.classList.add("modal-delete-btn-wrap", "modal-delete-btn-wrap_hidden");
  btnDeleteContact.classList.add("modal__new-contact-delete", "btn-reset");

  optionsTel.textContent = "Телефон";
  optionsEmail.textContent = "Email";
  optionsFB.textContent = "Facebook";
  optionsVK.textContent = "VK";
  optionsOther.textContent = "Другое";
  inputContact.placeholder = "Введите данные контакта";

  wrapperContactBlock.append(wrapperNewContac);
  wrapperNewContac.append(selectTypeContact);
  selectTypeContact.append(optionsTel);
  selectTypeContact.append(optionsEmail);
  selectTypeContact.append(optionsFB);
  selectTypeContact.append(optionsVK);
  selectTypeContact.append(optionsOther);

  wrapperNewContac.append(inputContactWrap);
  inputContactWrap.append(inputContact);

  inputContactWrap.append(btnDeleteWrap);
  btnDeleteWrap.append(btnDeleteContact);
  btnDeleteContact.append(btnDeleteContactSvg());
  btnDeleteContact.append(btnDeleteContactSvgHover());

  multiSelect();

  // Появление кнопки удаление в блоке контакта клиента
  inputContact.addEventListener('input', () => {
    if (inputContact.value) {
      btnDeleteWrap.classList.remove('modal-delete-btn-wrap_hidden');
    } else {
      btnDeleteWrap.classList.add('modal-delete-btn-wrap_hidden');
    }
  })

  // Удаление контакта в модальном окне
  btnDeleteContact.addEventListener("click", () => {
    wrapperNewContac.remove();
    disabledBtnNewContact(wrapperContactBlock, btnAddNewContact);
    disabledBtnNewContactChange(wrapperContactBlock, btnAddNewContactChange);
  });

  btnAddNewContact = document.getElementById("new-add-contact");
  btnAddNewContactChange = document.getElementById("change-add-contact");
  disabledBtnNewContact(wrapperContactBlock, btnAddNewContact);
  disabledBtnNewContactChange(wrapperContactBlock, btnAddNewContactChange);

  return {
    btnDeleteContact,
    wrapperNewContac,
    wrapperContactBlock,
    inputContact,
  };
}

// Отключение кнопки добавления контакта при кол-ве 10 и болеев окне нового клиента
function disabledBtnNewContact(wraperContact, btn) {
  let btnAddNewContactWrap = document.querySelector(
    ".modal__new-add-contact-wrap"
  );

  let wrapperContactBlock = document.getElementById("contact-wrap");
  const items = wraperContact.querySelectorAll(".modal__new-contact-wrap");
  if (items.length >= 10) {
    btn.disabled = true;
  } else if (items.length === 0) {
    btnAddNewContactWrap.classList.remove("modal__new-add-contact-wrap_pb");
    wrapperContactBlock.classList.remove("modal__contact-wrap-add");
  } else {
    btn.disabled = false;
  }
  // Костыль
  let modalNewClient = document.getElementById('modal-new-client');
  if (items.length > 6) {
    modalNewClient.classList.add('modal-new-client-top120');
  } else if (items.length < 7) {
    modalNewClient.classList.remove('modal-new-client-top120');
  }
}

// Отключение кнопки добавления контакта при кол-ве 10 и более в окне изменения клиента
function disabledBtnNewContactChange(wraperContact, btn) {
  let btnAddNewContactWrapChange = document.querySelector(
    ".modal__change-add-contact-wrap"
  );
  let wrapperContactBlockChange = document.getElementById("change-contact-wrap");
  let items = wraperContact.querySelectorAll(".modal__new-contact-wrap-change");
  if (items.length >= 10) {
    btn.disabled = true;
  } else if (items.length === 0) {
    btnAddNewContactWrapChange.classList.remove("modal__new-add-contact-wrap_pb");
    wrapperContactBlockChange.classList.remove("modal__contact-wrap-add");
  } else {
    btn.disabled = false;
  }
}

// Создание элемента li (контакта) для списка контактов клиента
function createLiContact(contact, visible) {
  let liContact = document.createElement("li");
  let imgContact = document.createElement("img");
  let liСircleBtn = document.createElement("span");
  liContact.classList.add("tbody__contacts-item");
  imgContact.classList.add("tbody__contacts-img");

  if (!visible) {
    liContact.classList.add("tbody__contacts-item_hidden");
  }

  switch (contact.type) {
    case "Телефон":
      imgContact.setAttribute("data-tippy-content", "Телефон:" + " " + contact.value);
      imgContact.setAttribute("src", "./img/phone.svg");
      imgContact.setAttribute("alt", "Телефон");
      break;
    case "Facebook":
      imgContact.setAttribute(
        "data-tippy-content",
        "Facebook:" + " " + contact.value
      );
      imgContact.setAttribute("src", "./img/fb.svg");
      imgContact.setAttribute("alt", "Facebook");
      break;
    case "VK":
      imgContact.setAttribute(
        "data-tippy-content",
        "VK:" + " " + contact.value
      );
      imgContact.setAttribute("src", "./img/vk.svg");
      imgContact.setAttribute("alt", "ВКонтакте");
      break;
    case "Email":
      imgContact.setAttribute(
        "data-tippy-content",
        "Email:" + " " + contact.value
      );
      imgContact.setAttribute("src", "./img/mail.svg");
      imgContact.setAttribute("alt", "E-mail");
      break;
    case "Другое":
      imgContact.setAttribute(
        "data-tippy-content",
        "Другое:" + " " + contact.value
      );
      imgContact.setAttribute("src", "./img/other.svg");
      imgContact.setAttribute("alt", "Другое");
      break;
  }

  liContact.append(imgContact);

  return liContact;
}

// Создание списка ul контактов клиента
function createUlContact(contacts) {
  let ulContact = document.createElement("ul");
  ulContact.classList.add("tbody__contacts-list");
  let liСircleBtn = document.createElement("li");
  liСircleBtn.classList.add("tbody__contacts-item");
  let СircleBtn = document.createElement("span");
  СircleBtn.classList.add("tbody__contacts-icon-add");
  СircleBtn.classList.add("tbody__contacts-icon-add-hidden");
  let visible = true;

  for (let i = 0; contacts.length > i; i++) {
    contacts[i].value.cssText = 'color: blue';
    if (i >= 4) {
      СircleBtn.classList.remove("tbody__contacts-icon-add-hidden");
    }
    let liContactUl = createLiContact(contacts[i], visible);
    ulContact.append(liContactUl);
    if (i === 3) {
      visible = false;
      СircleBtn.classList.add("tbody__contacts-icon-add");
      СircleBtn.textContent = `+${contacts.length - i - 1}`;
      СircleBtn.setAttribute("data-tippy-content", "Раскрыть список контактов");
      liСircleBtn.append(СircleBtn);
      ulContact.append(liСircleBtn);
    }
  }

  liСircleBtn.addEventListener("click", () => {
    ulContact.innerHTML = "";
    visible = true;
    for (let i = 0; contacts.length > i; i++) {
      let liContactUl = createLiContact(contacts[i], visible);
      ulContact.append(liContactUl);
      tippy("[data-tippy-content]");
    }
  });

  return ulContact;
}

let clientTable = document.getElementById("table-tbody");
let idDeleteClient = null;
let idDeleteClientChange = null;

// Вывод в таблицу строки одного клиента
function createClientItem(clientObj) {
  clientTable = document.getElementById("table-tbody");

  let clientTableTR = document.createElement("tr");
  let tdID = document.createElement("td");
  let tdFIO = document.createElement("td");
  let tdStart = document.createElement("td");
  let tdStartDate = document.createElement("span");
  let tdStartTime = document.createElement("span");
  let tdChange = document.createElement("td");
  let tdChangeDate = document.createElement("span");
  let tdChangeTime = document.createElement("span");
  let tdContacts = document.createElement("td");
  let ulContacts = document.createElement("ul");
  let tdActions = document.createElement("td");
  let btnChanges = document.createElement("button");
  let btnChangesIcon = document.createElement("span");
  let btnChangesIconRing = document.createElement("span");
  let btnChangesText = document.createElement("span");
  let btnDelete = document.createElement("button");
  let btnDeleteIcon = document.createElement("span");
  let btnDeleteIconRing = document.createElement("span");
  let btnDeleteText = document.createElement("span");

  tdID.classList.add("tbody__td", "tbody__id", "tbody__td_grey");
  tdFIO.classList.add("tbody__td", "tbody__fio");
  tdStart.classList.add("tbody__td", "tbody__start");
  tdStartDate.classList.add("tbody__start-date");
  tdStartTime.classList.add("tbody__start-time", "tbody__text-grey");
  tdChange.classList.add("tbody__td", "tbody__changes");
  tdChangeDate.classList.add("tbody__changes-date");
  tdChangeTime.classList.add("tbody__changes-time", "tbody__text-grey");
  tdContacts.classList.add("tbody__td", "tbody__contacts");
  ulContacts.classList.add("tbody__contacts-list");
  tdActions.classList.add("tbody__td", "tbody__actions");
  btnChanges.classList.add("tbody__btn", "btn-reset", "tbody__btn_changes");
  btnChangesIcon.classList.add("tbody__icon-img");
  btnChangesIconRing.classList.add("tbody__icon-img-ring", "tbody__icon-changes_hidden");
  btnChangesText.classList.add("tbody__icon-text");
  btnDelete.classList.add("tbody__btn", "btn-reset", "tbody__btn_delete");
  btnDeleteIcon.classList.add("tbody__icon-delete-img");
  btnDeleteIconRing.classList.add("tbody__icon-delete-img-ring", "tbody__icon-delete_hidden");
  btnDeleteText.classList.add("tbody__delete-text");

  btnChanges.setAttribute('id', 'btn-change-client');
  btnDelete.setAttribute('id', 'btn-delete-client');

  tdID.textContent = clientObj.id;
  tdFIO.textContent = getFullName(clientObj);
  tdStartDate.textContent = getCreatedDayFormat(clientObj);
  tdStartTime.textContent = getCreatedTimeFormat(clientObj);
  tdChangeDate.textContent = getUpdatedDayFormat(clientObj);
  tdChangeTime.textContent = getUpdatedTimeFormat(clientObj);

  btnChangesText.textContent = "Изменить";
  btnDeleteText.textContent = "Удалить";

  clientTableTR.append(tdID);
  clientTableTR.append(tdFIO);
  clientTableTR.append(tdStart);
  tdStart.append(tdStartDate);
  tdStart.append(tdStartTime);
  clientTableTR.append(tdChange);
  tdChange.append(tdChangeDate);
  tdChange.append(tdChangeTime);
  clientTableTR.append(tdContacts);

  tdContacts.append(createUlContact(clientObj.contacts));

  clientTableTR.append(tdActions);
  tdActions.append(btnChanges);
  btnChanges.append(btnChangesIcon);
  btnChanges.append(btnChangesIconRing);
  btnChanges.append(btnChangesText);
  tdActions.append(btnDelete);
  btnDelete.append(btnDeleteIcon);
  btnDelete.append(btnDeleteIconRing);
  btnDelete.append(btnDeleteText);

  clientTable.append(clientTableTR);

  // Открыть модальное окно изменения клиента
  btnChanges.addEventListener("click", function () {

    btnChangesIcon.classList.add('tbody__icon-changes_hidden');
    btnChangesIconRing.classList.remove('tbody__icon-changes_hidden');

    setTimeout(() => {
      document.getElementById("modal__change").classList.add("modal-visible");
      btnChangesIcon.classList.remove('tbody__icon-changes_hidden');
      btnChangesIconRing.classList.add('tbody__icon-changes_hidden');
    }, 300);

    document.getElementById('change-id').textContent = 'ID:' + ' ' + clientObj.id;
    document.getElementById('change-surname').value = clientObj.surname;
    document.getElementById('change-name').value = clientObj.name;
    document.getElementById('change-lastname').value = clientObj.lastName;

    let changeContactsArr = clientObj.contacts;
    let btnAddNewContactWrap = document.querySelector(".modal__change-add-contact-wrap");
    if (clientObj.contacts.length) {
      btnAddNewContactWrap.classList.add("modal__new-add-contact-wrap_pb");
    } else {
      btnAddNewContactWrap.classList.remove("modal__new-add-contact-wrap_pb");
    }
    changeContactsArr.forEach((contactObj) => {
      let temp = createNewContact('change-contact-wrap', 'change-contact-delete', 'modal__new-contact-wrap-change');
    });

    let changeContactBlock = document.querySelectorAll('.modal__new-contact-wrap-change');
    for (let i = 0; i < changeContactBlock.length; i++) {
      const element = changeContactBlock[i];
      let changeContactsArrItem = Object.values(changeContactsArr[i]);

      let changeChoicesSelect = element.querySelector('.choices__item--selectable');
      changeChoicesSelect.setAttribute('data-value', 'changeContactsArrItem[0]');
      changeChoicesSelect.innerHTML = changeContactsArrItem[0];

      let changeInput = element.querySelector('.modal__contact-input');
      changeInput.value = changeContactsArrItem[1];
    }

    let btnDeleteWrapFromChange = document.querySelectorAll('.modal-delete-btn-wrap');
    btnDeleteWrapFromChange.forEach((btn) => {
      btn.classList.remove('modal-delete-btn-wrap_hidden');
    })
  });

  // Удалить клиента

  btnDelete.addEventListener('click', async () => {
    btnDeleteIcon.classList.add('tbody__icon-delete-img-ring');
    btnDeleteIconRing.classList.remove('tbody__icon-delete-img-ring');
    idDeleteClient = clientObj.id;
    setTimeout(() => {
      document.getElementById("modal-delete").classList.add("modal-visible");
      btnDeleteIcon.classList.remove('tbody__icon-delete-img-ring');
      btnDeleteIconRing.classList.add('tbody__icon-delete-img-ring');
    }, 300);
  })

  return {
    btnDelete,
    btnChanges,
  }
}

let tableOverlay = document.getElementById('table-overlay');

function renderClientsTable(clientsArray) {
  for (let item of clientsArray) {
    createClientItem(item);
    tippy("[data-tippy-content]");
  }
}

// Рендеринг таблицы
document.addEventListener("DOMContentLoaded", async function () {
  let btnAddNewContact = document.getElementById("new-add-contact");
  let btnAddNewContactChange = document.getElementById("change-add-contact");
  let btnAddNewContactWrap = document.querySelector(
    ".modal__new-add-contact-wrap"
  );
  let btnAddChangeContactWrap = document.querySelector(
    ".modal__change-add-contact-wrap"
  );


  await updateСlientsListFromServer();

  // Добавление блока контакта в модальном окне нового контакта
  btnAddNewContact.addEventListener("click", function () {
    if (
      !btnAddNewContactWrap.classList.contains("modal__new-add-contact-wrap_pb")
    ) {
      btnAddNewContactWrap.classList.add("modal__new-add-contact-wrap_pb");
    }
    createNewContact('contact-wrap', 'new-contact-delete', 'modal__new-contact-wrap');
  });

  // Добавление блока контакта в модальном окне изменения контакта
  btnAddNewContactChange.addEventListener("click", function () {
    if (
      !btnAddChangeContactWrap.classList.contains("modal__new-add-contact-wrap_pb")
    ) {
      btnAddChangeContactWrap.classList.add("modal__new-add-contact-wrap_pb");
    }
    createNewContact('change-contact-wrap', 'change-contact-delete', 'modal__new-contact-wrap-change');
  });

  // Получение объекта нового клиента из формы
  let newClientForm = document.getElementById("new-form");
  let newName = document.getElementById('new-name');
  let newSurname = document.getElementById('new-surname');
  let newLastname = document.getElementById('new-lastname');

  // Добавление клиента
  newClientForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Получение объекта данных одного клиента из формы модального окна
    let inputType = document.querySelectorAll('.choices__item--selectable' && '[data-item]');
    let inputText = document.querySelectorAll('.modal__contact-input');

    // Получение массива контактов клиента
    let newContactArr = [];
    for (let i = 0; i < inputType.length; i++) {
      if (!inputText[i].value) continue;
      newContactArr.push({
        type: inputType[i].textContent,
        value: inputText[i].value.trim(),
      });
    }

    let newClientObj = {
      name: newName.value,
      surname: newSurname.value,
      lastName: newLastname.value,
      contacts: newContactArr,
    }

    await serverAddClients(newClientObj);
    cleaningModalFromContacts('contact-wrap', '.modal__new-add-contact-wrap');
    document.getElementById("modal__new").classList.remove("modal-visible");
    clientTable.innerHTML = '';
    await updateСlientsListFromServer();
    cleaningInputModal();

    renderClientsTable(clientsList);
  });


  // Изменить данные клиента
  let changeClientForm = document.getElementById('change-save');
  changeClientForm.addEventListener("click", async () => {

    let changeName = document.getElementById('change-name');
    let changeSurname = document.getElementById('change-surname');
    let changeLastname = document.getElementById('change-lastname');

    // Получение объекта данных одного клиента из формы модального окна
    let inputType = document.querySelectorAll('.choices__item--selectable' && '[data-item]');
    let inputText = document.querySelectorAll('.modal__contact-input');

    // Получение массива контактов клиента
    let changeContactArr = [];
    for (let i = 0; i < inputType.length; i++) {
      if (!inputText[i].value) continue;
      changeContactArr.push({
        type: inputType[i].textContent,
        value: inputText[i].value.trim(),
      });
    }

    let changeClientObj = {
      name: changeName.value,
      surname: changeSurname.value,
      lastName: changeLastname.value,
      contacts: changeContactArr,
    }

    let idChangeClientForm = this.getElementById('change-id');
    let idChangeClient = idChangeClientForm.textContent.substring(4);

    await serverEditClients(changeClientObj, idChangeClient);
    cleaningModalFromContacts('change-contact-wrap', '.modal__change-add-contact-wrap');
    document.getElementById("modal__change").classList.remove("modal-visible");
    clientTable.innerHTML = '';
    await updateСlientsListFromServer();
    cleaningInputModal();

    renderClientsTable(clientsList);
  })

  // Удалить клиента через кнопку в строке таблицы
  document.getElementById('delete-client').addEventListener('click', async () => {
    document.getElementById("modal-delete").classList.remove("modal-visible");
    if (idDeleteClient !== null) {
      await serverDeleteClient(idDeleteClient);
      await updateСlientsListFromServer();
      clientTable.innerHTML = '';
      renderClientsTable(clientsList);
      idDeleteClient = null;
    }
  })

  // Удалить клиента в модальном окне изменения
  let deleteClientChange = document.getElementById('modal-change-delete');

  deleteClientChange.addEventListener('click', async () => {
    let idChangeClientForm = document.getElementById('change-id');
    idDeleteClientChange = idChangeClientForm.textContent.substring(4);
    document.getElementById('modal__change').classList.remove('modal-visible');
    document.getElementById("modal-delete").classList.add("modal-visible");
  })

  let btnDeleteFromChange = document.getElementById('delete-client');
  btnDeleteFromChange.addEventListener('click', async () => {
    document.getElementById("modal-delete").classList.remove("modal-visible");
    if (idDeleteClientChange !== null) {
      await serverDeleteClient(idDeleteClientChange);
      await updateСlientsListFromServer();
      clientTable.innerHTML = '';
      renderClientsTable(clientsList);
      idDeleteClientChange = null;
    }
  })

  // Сортировка клиентов
  let theadID = document.getElementById('thead-id');
  let theadFIO = document.getElementById('thead-fio');
  let theadStart = document.getElementById('thead-start');
  let theadChange = document.getElementById('thead-changes');
  let theadFioWord = document.querySelector('.thead__fio-sort');

  let idArrow = document.querySelector('.thead__arrow-sort-id');
  let fioArrow = document.querySelector('.thead__arrow-sort-fio');
  let startArrow = document.querySelector('.thead__arrow-sort-start');
  let changesArrow = document.querySelector('.thead__arrow-sort-changes');

  let sortWay = true;

  // Функция поворота стрелки сортировки
  function arrowRotate(typeArrow) {
    if (!sortWay) {
      typeArrow.classList.add('thead__arrow-sort-id_rotate');
    } else {
      typeArrow.classList.remove('thead__arrow-sort-id_rotate');
    }
  }

  // Сортировка
  theadID.addEventListener('click', () => {
    newArr = [...clientsList];
    sortWay = !sortWay;
    arrowRotate(idArrow);
    sortClients(newArr, 'id', sortWay);
    clientTable.innerHTML = '';
    renderClientsTable(newArr);
  })

  theadFIO.addEventListener('click', () => {
    newArr = [...clientsList];
    sortWay = !sortWay;
    if (!sortWay) {
      theadFioWord.textContent = 'А-Я';
    } else {
      theadFioWord.textContent = 'Я-А';
    }
    arrowRotate(fioArrow);
    sortClients(newArr, 'surname', sortWay);
    clientTable.innerHTML = '';
    renderClientsTable(newArr);
  })

  theadStart.addEventListener('click', () => {
    newArr = [...clientsList];
    sortWay = !sortWay;
    arrowRotate(startArrow);
    sortClients(newArr, 'createdAt', sortWay);
    clientTable.innerHTML = '';
    renderClientsTable(newArr);
  })

  theadChange.addEventListener('click', () => {
    newArr = [...clientsList];
    sortWay = !sortWay;
    arrowRotate(changesArrow);
    sortClients(newArr, 'updatedAt', sortWay);
    clientTable.innerHTML = '';
    renderClientsTable(newArr);
  })

  // Поиск клиентов
  let inputSearch = document.getElementById('header-search');
  inputSearch.addEventListener('input', async () => {
    setTimeout(async function () {
      if (inputSearch.value.trim()) {
        let searchClient = await serverSearchClient(inputSearch.value);
        clientTable.innerHTML = '';
        renderClientsTable(searchClient);
      } else if (!inputSearch.value.trim()) {
        clientTable.innerHTML = '';
        renderClientsTable(clientsList);
      }
    }, 500)
  });

  tableOverlay.classList.remove('main__table-overlay_hidden');
  setTimeout(() => {
    for (let item of clientsList) {
      createClientItem(item);
      tippy("[data-tippy-content]");
    }
    tableOverlay.classList.add('main__table-overlay_hidden');
  }, 500);
});