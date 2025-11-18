import { rootReducer } from '../src/services/rootReducer/rootReducer';
import { initialState as ingredientsInitialState } from '../src/services/slices/ingredientsSlice';
import { initialState as constructorInitialState } from '../src/services/slices/constructorSlice';
import { initialState as orderInitialState } from '../src/services/slices/orderSlice';
import { initialState as authInitialState } from '../src/services/slices/authSlice';

describe('rootReducer', () => {
  it('тест инициализации rootReducer', () => {
    //создаем начальное состояние
    const state = rootReducer(undefined, { type: '@@INIT' });
    //проверяем, что рут редьюсер правильно объединяет все редьюсеры и что каждый слайс инициализируется со своим начальным состоянием
    expect(state).toEqual({
      ingredients: ingredientsInitialState,
      burgerConstructor: constructorInitialState,
      order: orderInitialState,
      auth: authInitialState
    });
  });

  it('тест обработки неизвестных экшенов', () => {
    //передаем неизвестный экшн
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    //проверяем, что стейт определился (приложение не упало)
    expect(state).toBeDefined();
    //проверяем, что возращается валидное состояние
    expect(typeof state).toBe('object');
  });
});
