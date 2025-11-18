export { default as ingredientsReducer } from './slices/ingredientsSlice';
export { default as constructorReducer } from './slices/constructorSlice';
export { default as orderReducer } from './slices/orderSlice';
export { default as authReducer } from './slices/authSlice';

export { fetchIngredients } from './slices/ingredientsSlice';

export {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './slices/constructorSlice';

export { createOrder, clearOrder } from './slices/orderSlice';

export {
  loginUser,
  registerUser,
  logoutUser,
  getUser,
  updateUser,
  clearError
} from './slices/authSlice';

export type { TIngredientsState } from './slices/ingredientsSlice';
export type { TConstructorState } from './slices/constructorSlice';
export type { TOrderState } from './slices/orderSlice';
export type { TAuthState } from './slices/authSlice';
