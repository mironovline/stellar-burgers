import constructorReducer, {
  initialState,
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../src/services/slices/constructorSlice';
import { TIngredient } from '../src/utils/types';

//моки данных
const mockBun: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const mockMain: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

const mockSauce: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 14,
  carbohydrates: 22,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
};

describe('constructorSlice', () => {
  it('должен обрабатывать начальное состояние', () => {
    //корректное начальное состояние
    expect(constructorReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен обрабатывать добавление булки', () => {
    const action = addBun(mockBun);
    const state = constructorReducer(initialState, action);
    //булка сохранена
    expect(state.bun).toEqual(mockBun);
    //начинок нет
    expect(state.ingredients).toEqual([]);
  });

  it('должен обрабатывать добавление начинки', () => {
    const action = addIngredient(mockMain);
    const state = constructorReducer(initialState, action);
    //добавлен 1 ингредиент
    expect(state.ingredients).toHaveLength(1);
    //сгенерирован уникальный id
    expect(state.ingredients[0]).toMatchObject({
      ...mockMain,
      id: expect.stringContaining(mockMain._id)
    });
  });

  it('должен обрабатывать добавление соуса', () => {
    const action = addIngredient(mockSauce);
    const state = constructorReducer(initialState, action);
    //добавлен 1 ингредиент
    expect(state.ingredients).toHaveLength(1);
    //сгенерирован уникальный id
    expect(state.ingredients[0]).toMatchObject({
      ...mockSauce,
      id: expect.stringContaining(mockSauce._id)
    });
  });

  it('должен удалять ингредиент из начинки', () => {
    //добавляем ингредиент
    const addAction = addIngredient(mockMain);
    let state = constructorReducer(initialState, addAction);
    //запоминаем id
    const ingredientId = state.ingredients[0].id;

    const removeAction = removeIngredient(ingredientId);
    state = constructorReducer(state, removeAction);
    //проверяем, что ингредиент удален
    expect(state.ingredients).toHaveLength(0);
  });

  it('должен перемещать ингредиент', () => {
    let state = initialState;
    //будет на позиции 0
    const addAction1 = addIngredient(mockMain);
    state = constructorReducer(state, addAction1);
    //будет на позиции 1
    const addAction2 = addIngredient(mockSauce);
    state = constructorReducer(state, addAction2);

    const moveAction = moveIngredient({ fromIndex: 0, toIndex: 1 });
    state = constructorReducer(state, moveAction);
    //соус стал первым
    expect(state.ingredients[0]._id).toBe(mockSauce._id);
    //котлета вторая
    expect(state.ingredients[1]._id).toBe(mockMain._id);
  });

  it('должен очищать конструктор', () => {
    let state = initialState;
    const addBunAction = addBun(mockBun);
    state = constructorReducer(state, addBunAction);

    const addIngAction = addIngredient(mockMain);
    state = constructorReducer(state, addIngAction);

    const clearAction = clearConstructor();
    state = constructorReducer(state, clearAction);
    //булка удалена
    expect(state.bun).toBeNull();
    //начинки тоже удалены
    expect(state.ingredients).toEqual([]);
  });
});
