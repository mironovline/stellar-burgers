import orderReducer, {
  initialState,
  createOrder,
  fetchFeeds,
  fetchUserOrders,
  clearOrder
} from '../src/services/slices/orderSlice';
import { TOrder } from '../src/utils/types';

// моки данных
const mockOrder: TOrder = {
  _id: '64e8d3e82e5b8c001b477aa1',
  ingredients: [
    '643d69a5c3f7b9001cfa093c',
    '643d69a5c3f7b9001cfa0941',
    '643d69a5c3f7b9001cfa093c'
  ],
  status: 'done',
  name: 'Краторный space бургер',
  createdAt: '2023-08-25T14:00:00.000Z',
  updatedAt: '2023-08-25T14:00:00.000Z',
  number: 12345
};

const mockFeedsResponse = {
  orders: [mockOrder],
  total: 100,
  totalToday: 10
};

describe('orderSlice', () => {
  it('должен обрабатывать начальное состояние', () => {
    //редьюсер возвращает корректное начальное состояние при инициализации
    expect(orderReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('тест начала создания заказа', () => {
    const action = { type: createOrder.pending.type };
    const state = orderReducer(initialState, action);
    //включается индикатор загрузки
    expect(state.loading).toBe(true);
    //очищаются предыдущие ошибки
    expect(state.error).toBeNull();
  });

  it('тест успешного создания заказа', () => {
    const action = {
      type: createOrder.fulfilled.type,
      payload: mockOrder
    };
    const state = orderReducer({ ...initialState, loading: true }, action);
    //загрузка завершена
    expect(state.loading).toBe(false);
    //данные заказа сохранены
    expect(state.orderData).toEqual(mockOrder);
    //ошибок нет
    expect(state.error).toBeNull();
  });

  it('тест ошибки при создании заказа', () => {
    const errorMessage = 'Order creation failed';
    const action = {
      type: createOrder.rejected.type,
      error: { message: errorMessage }
    };
    const state = orderReducer({ ...initialState, loading: true }, action);
    //загрузка завершена
    expect(state.loading).toBe(false);
    //ошибка сохранена
    expect(state.error).toBe(errorMessage);
  });

  it('должен сохранять данные ленты при успешной загрузке', () => {
    const action = {
      type: fetchFeeds.fulfilled.type,
      payload: mockFeedsResponse
    };
    const state = orderReducer(initialState, action);
    //заказы сохранены
    expect(state.orders).toEqual([mockOrder]);
    //общее количество соответствует мокам
    expect(state.total).toBe(100);
    //количество за сегодня тоже соответсвует мокам
    expect(state.totalToday).toBe(10);
  });

  it('должен сохранять успешную загрузку заказов пользователя', () => {
    const action = {
      type: fetchUserOrders.fulfilled.type,
      payload: [mockOrder]
    };
    const state = orderReducer({ ...initialState, loading: true }, action);
    //загрузка завершена
    expect(state.loading).toBe(false);
    //заказы сохранены
    expect(state.orders).toEqual([mockOrder]);
  });

  it('тест очистки данных заказа', () => {
    const stateWithData = {
      ...initialState,
      orderData: mockOrder,
      error: 'Some error'
    };
    const action = clearOrder();
    const state = orderReducer(stateWithData, action);
    //данные заказа очищены
    expect(state.orderData).toBeNull();
    //ошибка очищена
    expect(state.error).toBeNull();
  });
});
