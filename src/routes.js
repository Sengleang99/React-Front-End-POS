import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const Product = React.lazy(() => import('./views/theme/Product/Product'))
const Customer = React.lazy(() => import('./views/theme/Customer/Customer'))
const Category = React.lazy(() => import('./views/theme/Category/Category'))
const POS = React.lazy(() => import('./views/theme/POS/POS'))
const Payment = React.lazy(() => import('./views/theme/Payment/Payment'))
const Employee = React.lazy(() => import('./views/theme/Employee/Employee'))
const Order = React.lazy(() => import('./views/theme/Order/Order'))
const OrderDetail = React.lazy(() => import('./views/theme/OrderDetail/OrderDetail'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme/Product', name: 'Product', element: Product },
  { path: '/theme/Customer', name: 'Customer', element: Customer },
  { path: '/theme/Category', name: 'Category', element: Category },
  { path: '/theme/POS', name: 'POS', element: POS },
  { path: '/theme/Payment', name: 'Payment', element: Payment },
  { path: '/theme/Employee', name: 'Employee', element: Employee },
  { path: '/theme/Customer', name: 'Customer', element: Customer },
  { path: '/theme/Order', name: 'Order', element: Order },
  { path: '/theme/OrderDetail', name: 'OrderDetail', element: OrderDetail },
]

export default routes
