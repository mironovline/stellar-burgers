// services/store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from '..';
import { constructorReducer } from '..';
import { orderReducer } from '..';
import { authReducer } from '..';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  auth: authReducer
});

export type RootState = ReturnType<typeof rootReducer>;
