describe('Конструктор бургера', () => {
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
      cy.get('[data-cy=burger-ingredients]').should('exist');
      // проверяем, что есть хотя бы 5 ингредиентов
      cy.get('[data-cy=burger-ingredient]').should('have.length.at.least', 5);
    });
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('тест добавления булки', () => {
      cy.contains('Выберите булки').should('exist');

      // находим булку и кликаем на нее
      cy.get('[data-cy=burger-ingredient]')
        .first()
        .within(() => {
          cy.get('button').click();
        });

      // проверяем что сообщение "Выберите булки" исчезло
      cy.contains('Выберите булки').should('not.exist');

      // проверяем что появилась булка (верх)
      cy.contains('верх').should('exist');

      // проверяем что появилась булка (низ)
      cy.contains('низ').should('exist');
    });

    it('тест добавления начинки', () => {
      // сначала находим булку и кликаем на нее
      cy.get('[data-cy=burger-ingredient]')
        .first()
        .within(() => {
          cy.get('button').click();
        });

      // находим первую начинку
      cy.get('[data-cy=burger-ingredient]')
        .eq(2)
        .within(() => {
          cy.get('button').click({ force: true });
        });

      // проверяем, что сообщение "Выберите начинку" исчезло
      cy.get('[data-cy=no-fillings-message]').should('not.exist');

      // проверяем, что начинка добавилась в конструктор
      cy.get('[data-cy=constructor-filling]').should('exist');
      cy.contains('Говяжий метеорит').should('exist');
    });

    it('при добавлении булки и начинки должна появиться кнопка оформления заказа', () => {
      // сначала находим булку и кликаем на нее
      cy.get('[data-cy=burger-ingredient]')
        .first()
        .within(() => {
          cy.get('button').click();
        });

      // добавляем начинку
      cy.get('[data-cy=burger-ingredient]')
        .eq(2)
        .within(() => {
          cy.get('button').click();
        });

      // проверяем, что кнопка "Оформить заказ" активна
      cy.contains('Оформить заказ').should('exist');

      // нажимаем кнопку оформления заказа
      cy.contains('Оформить заказ').click();
    });
  });

  describe('Модальные окна', () => {
    it('при клике на ингредиент должно открыться модальное окно', () => {
      // находим первый ингредиент
      const ingredient = cy.get('[data-cy=burger-ingredient]').first();
      // кликаем на ингредиент
      ingredient.click();

      // проверяем, что модальное окно открылось
      cy.get('[data-cy=modal]').should('exist');
      // проверяем, что в модальном окне есть заголовок с деталями ингредиента
      cy.get('[data-cy=modal]').contains('Детали ингридиента');
      // проверяем, что отобразились детали ингредиента
      cy.get('[data-cy=ingredient-details]').should('exist');
    });

    it('при клике на крестик модальное окно должно закрыться', () => {
      // открываем модальное окно
      cy.get('[data-cy=burger-ingredient]').first().click();
      // проверяем что модальное окно открылось
      cy.get('[data-cy=modal]').should('exist');

      // находим кнопку закрытия
      const closeButton = cy.get('[data-cy=modal-close]');
      // кликаем на крестик
      closeButton.click();

      // проверяем, что модальное окно закрылось
      cy.get('[data-cy=modal]').should('not.exist');
    });

    it('при клике на оверлей модальное окно должно закрыться', () => {
      // открываем модальное окно
      cy.get('[data-cy=burger-ingredient]').first().click();
      // проверяем, что модальное окно открылось
      cy.get('[data-cy=modal]').should('exist');

      // находим оверлей
      cy.get('[data-cy=modal-overlay]').click({ force: true });

      // проверяем, что модальное окно закрылось
      cy.get('[data-cy=modal]').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    it('после оформления заказа должно открыться модальное окно с номером', () => {
      // сначала находим булку и кликаем на нее
      cy.get('[data-cy=burger-ingredient]')
        .first()
        .within(() => {
          cy.get('button').click();
        });

      // добавляем начинку
      cy.get('[data-cy=burger-ingredient]')
        .eq(2)
        .within(() => {
          cy.get('button').click();
        });

      // находим кнопку оформления заказа
      const orderButton = cy.get('[data-cy=order-button]');
      // проверяем, что кнопка содержит текст "Оформить заказ"
      orderButton.contains('Оформить заказ');
      // кликаем на кнопку
      orderButton.click();

      // проверяем, что открылось модальное окно заказа
      cy.get('[data-cy=order-details-content]').should('exist');
      // проверяем, что в модальном окне есть номер заказа
      cy.get('[data-cy=order-number]').should('contain', '12345');
    });

    it('после закрытия модального окна заказа конструктор должен очиститься', () => {
      // сначала находим булку и кликаем на нее
      cy.get('[data-cy=burger-ingredient]')
        .first()
        .within(() => {
          cy.get('button').click();
        });

      // добавляем начинку
      cy.get('[data-cy=burger-ingredient]')
        .eq(2)
        .within(() => {
          cy.get('button').click();
        });

      // находим кнопку оформления заказа
      const orderButton = cy.get('[data-cy=order-button]');
      // проверяем, что кнопка содержит текст "Оформить заказ"
      orderButton.contains('Оформить заказ');
      // кликаем на кнопку
      orderButton.click();

      // проверяем, что открылось модальное окно заказа
      cy.get('[data-cy=order-details-content]').should('exist');

      // закрываем модальное окно
      cy.get('[data-cy=modal-close]').click();

      // проверяем, что модальное окно закрылось
      cy.get('[data-cy=order-modal]').should('not.exist');
      // проверяем, что конструктор очистился - появилось сообщение о выборе булок
      cy.get('[data-cy=no-buns-message]').contains('Выберите булки');
      // проверяем, что появилось сообщение о выборе начинки
      cy.get('[data-cy=no-fillings-message]').contains('Выберите начинку');
    });
  });
});
