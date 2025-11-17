import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header} data-cy='app-header'>
    <nav className={`${styles.menu} p-4`}>
      <NavLink
        to='/'
        className={({ isActive }) =>
          `${styles.link} ${isActive ? styles.link_active : ''}`
        }
        data-cy='constructor-link'
      >
        <BurgerIcon type={'primary'} />
        <p className='text text_type_main-default ml-2 mr-10'>Конструктор</p>
      </NavLink>
      <NavLink
        to='/feed'
        className={({ isActive }) =>
          `${styles.link} ${isActive ? styles.link_active : ''}`
        }
        data-cy='feed-link'
      >
        <ListIcon type={'primary'} />
        <p className='text text_type_main-default ml-2'>Лента заказов</p>
      </NavLink>
      <div className={styles.logo} data-cy='app-logo'>
        <NavLink to='/'>
          <Logo className='' />
        </NavLink>
      </div>
      <NavLink
        to='/profile'
        className={({ isActive }) =>
          `${styles.link} ${isActive ? styles.link_active : ''}`
        }
        data-cy='profile-link'
      >
        <ProfileIcon type={'primary'} />
        <p className='text text_type_main-default ml-2'>
          {userName || 'Личный кабинет'}
        </p>
      </NavLink>
    </nav>
  </header>
);
