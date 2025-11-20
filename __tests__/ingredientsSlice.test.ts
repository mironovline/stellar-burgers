import ingredientsReducer, {
  initialState,
  fetchIngredients
} from '../src/services/slices/ingredientsSlice';
import { TIngredient } from '../src/utils/types';

// моки данных
const mockIngredients: TIngredient[] = [
  {
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
  },
  {
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
  },
  {
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
  }
];

describe('ingredientsSlice', () => {
  it('должен обрабатывать начальное состояние', () => {
    //редьюсер возвращает корректное начальное состояние
    expect(ingredientsReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен устанавливать loading в начале загрузки', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    //загрузка началась
    expect(state.loading).toBe(true);
    //ошибки очищены
    expect(state.error).toBeNull();
  });

  it('должен сохранять ингредиенты при успешной загрузке', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(
      { ...initialState, loading: true },
      action
    );
    //индикатор загрузки сбрасывается
    expect(state.loading).toBe(false);
    //игредиенты сохраняются в стейт и соответствуют моковым
    expect(state.ingredients).toEqual(mockIngredients);
    //ошибка очищена
    expect(state.error).toBeNull();
  });

  it('должен сохранять ошибку при неудачной загрузке', () => {
    const errorMessage = 'Network error';
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: errorMessage }
    };
    const state = ingredientsReducer(
      { ...initialState, loading: true },
      action
    );
    //индикатор загрузки сбрасывается
    expect(state.loading).toBe(false);
    //ошибка записана
    expect(state.error).toBe(errorMessage);
    //данные не изменились
    expect(state.ingredients).toEqual([]);
  });
});
