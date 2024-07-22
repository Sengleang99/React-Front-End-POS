import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilStar,
  cilApple,
  cilGroup,
  cilCart,
  cilChart,
  cilNotes,
  cilWallet
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
    },
  },
  {
    component: CNavTitle,
    name: 'Theme',
  },
  {
    component: CNavItem,
    name: 'POS',
    to: '/theme/POS',
    icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
  },  
  {
    component: CNavItem,
    name: 'Product',
    to: '/theme/Product',
    icon: <CIcon icon={cilApple} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Category',
    to: '/theme/Category',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Payment',
    to: '/theme/Payment',
    icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Employee',
    to: '/theme/Employee',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Customer',
    to: '/theme/Customer',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Order',
    to: '/theme/Order',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'OrderDetail',
    to: '/theme/OrderDetail',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Pages',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
      },
      {
        component: CNavItem,
        name: 'Register',
        to: '/register',
      },
    ],
  },

]

export default _nav
