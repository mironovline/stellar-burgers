describe('Конструктор бургера', () => {
  //константы
  const selectors = {
    burgerIngredient: '[data-cy=burger-ingredient]',
    burgerIngredientsSection: '[data-cy=burger-ingredients]',
    constructorFilling: '[data-cy=constructor-filling]',
    modal: '[data-cy=modal]',
    modalClose: '[data-cy=modal-close]',
    modalOverlay: '[data-cy=modal-overlay]',
    orderButton: '[data-cy=order-button]',
    orderDetailsContent: '[data-cy=order-details-content]',
    orderNumber: '[data-cy=order-number]',
    orderModal: '[data-cy=order-modal]',
    ingredientDetails: '[data-cy=ingredient-details]',
    noBunsMessage: '[data-cy=no-buns-message]',
    noFillingsMessage: '[data-cy=no-fillings-message]'
  };
  //часто используемые функции
  const addBun = () => {
    cy.get(selectors.burgerIngredient)
      .first()
      .within(() => {
        cy.get('button').click();
      });
  };

  const addFilling = () => {
    cy.get(selectors.burgerIngredient)
      .eq(2)
      .within(() => {
        cy.get('button').click();
      });
  };

  const openIngredientModal = () => {
    cy.get(selectors.burgerIngredient).first().click();
  };

  beforeEach(() => {
    // моки для всех необходимых запросов
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );
    cy.setCookie('accessToken', 'test-access-token');
    window.localStorage.setItem('refreshToken', 'test-refresh-token');

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });
  afterEach(() => {
    // очищаем токены после каждого теста
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Загрузка ингредиентов', () => {
    it('должны загрузиться и отобразиться ингредиенты', () => {
      // проверяем, что раздел с ингредиентами есть на странице
      cy.get(selectors.burgerIngredientsSection).should('exist');
      // проверяем, что есть хотя бы 5 ингредиентов
      cy.get(selectors.burgerIngredient).should('have.length.at.least', 5);
    });
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('тест добавления булки', () => {
      cy.contains('Выберите булки').should('exist');

      // находим булку и кликаем на нее
      addBun();

      // проверяем что сообщение "Выберите булки" исчезло
      cy.contains('Выберите булки').should('not.exist');

      // проверяем что появилась булка (верх)
      cy.contains('верх').should('exist');

      // проверяем что появилась булка (низ)
      cy.contains('низ').should('exist');
    });

    it('тест добавления начинки', () => {
      // сначала находим булку и кликаем на нее
      addBun();

      // находим первую начинку
      addFilling();

      // проверяем, что сообщение "Выберите начинку" исчезло
      cy.get(selectors.noFillingsMessage).should('not.exist');

      // проверяем, что начинка добавилась в конструктор
      cy.get(selectors.constructorFilling).should('exist');
      cy.contains('Говяжий метеорит').should('exist');
    });

    it('при добавлении булки и начинки должна появиться кнопка оформления заказа', () => {
      // сначала находим булку и кликаем на нее
      addBun();
      // добавляем начинку
      addFilling();
      // проверяем, что кнопка "Оформить заказ" активна
      cy.contains('Оформить заказ').should('exist');

      // нажимаем кнопку оформления заказа
      cy.contains('Оформить заказ').click();
    });
  });

  describe('Модальные окна', () => {
    it('при клике на ингредиент должно открыться модальное окно', () => {
      openIngredientModal();

      // проверяем, что модальное окно открылось
      cy.get(selectors.modal).should('exist');
      // проверяем, что в модальном окне есть заголовок с деталями ингредиента
      cy.get(selectors.modal).contains('Детали ингридиента');
      // проверяем, что отобразились детали ингредиента
      cy.get(selectors.ingredientDetails).should('exist');
    });

    it('при клике на крестик модальное окно должно закрыться', () => {
      // открываем модальное окно
      openIngredientModal();
      // проверяем что модальное окно открылось
      cy.get(selectors.modal).should('exist');

      // находим кнопку закрытия
      const closeButton = cy.get(selectors.modalClose);
      // кликаем на крестик
      closeButton.click();

      // проверяем, что модальное окно закрылось
      cy.get(selectors.modal).should('not.exist');
    });

    it('при клике на оверлей модальное окно должно закрыться', () => {
      // открываем модальное окно
      openIngredientModal();
      // проверяем, что модальное окно открылось
      cy.get(selectors.modal).should('exist');

      // находим оверлей
      cy.get(selectors.modalOverlay).click({ force: true });

      // проверяем, что модальное окно закрылось
      cy.get(selectors.modal).should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    it('после оформления заказа должно открыться модальное окно с номером', () => {
      // сначала находим булку и кликаем на нее
      addBun();

      // добавляем начинку
      addFilling();

      // находим кнопку оформления заказа
      const orderButton = cy.get(selectors.orderButton);
      // проверяем, что кнопка содержит текст "Оформить заказ"
      orderButton.contains('Оформить заказ');
      // кликаем на кнопку
      orderButton.click();

      // проверяем, что открылось модальное окно заказа
      cy.get(selectors.orderDetailsContent).should('exist');
      // проверяем, что в модальном окне есть номер заказа
      cy.get(selectors.orderNumber).should('contain', '12345');
    });

    it('после закрытия модального окна заказа конструктор должен очиститься', () => {
      // сначала находим булку и кликаем на нее
      addBun();

      // добавляем начинку
      addFilling();

      // находим кнопку оформления заказа
      const orderButton = cy.get(selectors.orderButton);
      // проверяем, что кнопка содержит текст "Оформить заказ"
      orderButton.contains('Оформить заказ');
      // кликаем на кнопку
      orderButton.click();

      // проверяем, что открылось модальное окно заказа
      cy.get(selectors.orderDetailsContent).should('exist');

      // закрываем модальное окно
      cy.get(selectors.modalClose).click();

      // проверяем, что модальное окно закрылось
      cy.get(selectors.orderModal).should('not.exist');
      // проверяем, что конструктор очистился - появилось сообщение о выборе булок
      cy.get(selectors.noBunsMessage).contains('Выберите булки');
      // проверяем, что появилось сообщение о выборе начинки
      cy.get(selectors.noFillingsMessage).contains('Выберите начинку');
    });
  });
});
