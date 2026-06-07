import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import BuilderPage from './pages/BuilderPage';
import CartPage from './pages/CartPage';
import OrderPage from './pages/OrderPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="builder" element={<BuilderPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="order" element={<OrderPage />} />
      </Route>
    </Routes>
  );
}

export default App;
