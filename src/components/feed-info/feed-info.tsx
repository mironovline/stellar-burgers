import { FC } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useEffect } from 'react';
import { fetchFeeds } from '../../services/slices/orderSlice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const dispatch = useDispatch();
  /** TODO: взять переменные из стора */
  const orders: TOrder[] = useSelector((state) => state.order.orders || []);
  const total = useSelector((state) => state.order.total || 0);
  const totalToday = useSelector((state) => state.order.totalToday || 0);

  const feed = {
    total,
    totalToday
  };
  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
