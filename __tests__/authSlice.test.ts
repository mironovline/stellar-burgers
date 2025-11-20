import authReducer, {
  initialState,
  loginUser,
  registerUser,
  logoutUser,
  getUser,
  updateUser,
  clearError
} from '../src/services/slices/authSlice';
import { TUser } from '../src/utils/types';

// моки данных
const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

describe('authSlice', () => {
  it('должен обрабатывать начальное состояние', () => {
    //ожидаем, что соответствует начальному состоянию
    expect(authReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('тест состояния загрузки при логине', () => {
    const action = { type: loginUser.pending.type };
    const state = authReducer(initialState, action);
    //ожидаем, что включился индикатор загрузки и очистились ошибки
    expect(state.loading).toBe(true);
    expect(state.error).toBeUndefined();
  });

  it('тест успешного логина', () => {
    const action = {
      type: loginUser.fulfilled.type,
      payload: mockUser
    };
    const state = authReducer({ ...initialState, loading: true }, action);
    //загрузка завершена
    expect(state.loading).toBe(false);
    //пользователь сохранен
    expect(state.user).toEqual(mockUser);
    //есть авторизация
    expect(state.isAuthenticated).toBe(true);
    //ошибок нет
    expect(state.error).toBeUndefined();
  });

  it('тест неудачного логина', () => {
    const errorMessage = 'Login failed';
    const action = {
      type: loginUser.rejected.type,
      error: { message: errorMessage }
    };
    const state = authReducer({ ...initialState, loading: true }, action);
    //загрузка завершена
    expect(state.loading).toBe(false);
    //ошибка сохранена
    expect(state.error).toBe(errorMessage);
    //авторизация не пройдена
    expect(state.isAuthenticated).toBe(false);
  });

  it('тест успешной регистрации', () => {
    const action = {
      type: registerUser.fulfilled.type,
      payload: mockUser
    };
    const state = authReducer({ ...initialState, loading: true }, action);
    //загрузка завершена
    expect(state.loading).toBe(false);
    //сохранили юзера в стейт и он соответствует мокам
    expect(state.user).toEqual(mockUser);
    //авторизация пройдена
    expect(state.isAuthenticated).toBe(true);
  });

  it('тест получения данных пользователя', () => {
    const action = {
      type: getUser.fulfilled.type,
      payload: mockUser
    };
    const state = authReducer(initialState, action);
    //сохранили юзера в стейт и он соответствует мокам
    expect(state.user).toEqual(mockUser);
    //авторизация пройдена
    expect(state.isAuthenticated).toBe(true);
  });

  it('тест неудачной проверки авторизации', () => {
    const action = { type: getUser.rejected.type };
    const state = authReducer(
      { ...initialState, user: mockUser, isAuthenticated: true },
      action
    );
    //данные юзера пустые
    expect(state.user).toBeNull();
    //авторизация не пройдена
    expect(state.isAuthenticated).toBe(false);
  });

  it('тест обновления данных пользователя', () => {
    const updatedUser = { ...mockUser, name: 'Updated User' };
    const action = {
      type: updateUser.fulfilled.type,
      payload: updatedUser
    };
    const state = authReducer({ ...initialState, user: mockUser }, action);
    //данные обновляются
    expect(state.user).toEqual(updatedUser);
  });

  it('тест очистки ошибок', () => {
    const stateWithError = {
      ...initialState,
      error: 'Some error'
    };
    const action = clearError();
    const state = authReducer(stateWithError, action);
    //ошибка очищается
    expect(state.error).toBeUndefined();
  });

  it('тест лог аута', () => {
    const stateWithUser = {
      ...initialState,
      user: mockUser,
      isAuthenticated: true
    };
    const action = { type: logoutUser.fulfilled.type };
    const state = authReducer(stateWithUser, action);
    //данные очищаются
    expect(state.user).toBeNull();
    //сбрасывается авторизация
    expect(state.isAuthenticated).toBe(false);
  });
});
