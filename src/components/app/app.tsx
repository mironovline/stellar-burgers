import '../../index.css';
import styles from './app.module.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { ProtectedRoute } from '../protected-route/ProtectedRoute';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { getUser } from '../../services/slices/authSlice';

const AppContent = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  const handleModalClose = () => {
    navigate(-1);
  };
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const getOrderNumber = () => {
    const path = location.pathname.split('/');
    const orderNumber = path[path.length - 1];
    return orderNumber;
  };
  const orderNumber = getOrderNumber();

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='*' element={<NotFound404 />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
      </Routes>

      {background && (
        <Routes>
          <Route path='*' element={<NotFound404 />} />
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={`Информация по заказу #${orderNumber}`}
                onClose={handleModalClose}
              >
                <>
                  <OrderInfo />
                </>
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингридиента' onClose={handleModalClose}>
                <>
                  <IngredientDetails />
                </>
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title={`Детали заказа ${orderNumber}`}
                onClose={handleModalClose}
              >
                <>
                  <ProtectedRoute>
                    <OrderInfo />
                  </ProtectedRoute>
                </>
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
