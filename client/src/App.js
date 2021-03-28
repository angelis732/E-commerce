import React from 'react';
import Navbar from './components/navBar/NavBar';
import { BrowserRouter, Route } from 'react-router-dom';
import Catalogue from './components/catalogue/Catalogue.jsx';
import Product from './components/Product/Product.jsx';
import NavCategories from "./components/Categories/NavCategories";
import CrudProduct from './components/CrudProduct/CrudProduct.jsx'
import NewCategoryForm from './components/NewCategoryForm/NewCategoryForm'
import SignUp from './components/User/SignUp'
import Main from './components/Main/Main'
import ProductsByCategory from "./components/Categories/ProductsByCategory";
import Footer from "./components/Footer/Footer"
import OrderDetails from "./components/OrderDetails/OrderDetails";
import OrderTable from "./components/OrderTable/OrderTable";
import UserTable from "./components/UserTable/UserTable";
import ViewOrder from './components/ViewOrder/ViewOrder';
import ResetPass from './components/ResetPass/ResetPass';
import GetEmail from './components/ResetPass/GetEmail';
import Login from './components/User/Login'
import UserProfile from "./components/UserProfile/UserProfile";
import PrivateRoute from './components/PrivateRoutes.js'
import CrudReview from './components/CrudReview/CrudReview';
import CheckOut from './components/CheckOut/CheckOut';
import Success from './components/CheckOut/Success';
import Failed from './components/CheckOut/Failed';
import SelectStates from "./components/OrderDetails/SelectStates";
import GoogleLogin from "./components/User/GoogleLogin";
import FacebookLogin from "./components/User/FacebookLogin";
import './Styles/App.scss'
import './App.scss';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import GlobalDiscount from './components/Discount/GlobalDiscount';

import UserOrdersTable from "./components/UserProfile/UserOrdersTable";




function App() {
  
  return (
    <BrowserRouter>
      <ScrollToTop/>
      <div className='body'>
        <div className="App">
          <header>
            <Navbar />
            <NavCategories />
          </header>
          <main>
            <div className="transparencia">
              <Route exact path="/users/me" component={UserProfile} />
              <Route exact path="/" component={Main} />
              <Route exact path='/products' component={Catalogue} />
              <Route exact path="/products/category/:categoryName" render={({ match }) => <ProductsByCategory key={match.params.categoryName} categoryName={match.params.categoryName} />} />
              <Route exact path="/products/detalle/:id" render={({ match }) => <Product key={match.params.id} id={match.params.id} />} />
              <Route exact path='/user/signup' component={SignUp} />
              <Route exact path='/auth/login' component={Login} />
              <Route exact path="/user/order" component={ViewOrder} />
              <Route exact path='/user/getEmail' component={GetEmail} />
              
              <Route exact path='/user/resetPass/:id' render={({match}) =><ResetPass key={match.params.id} id={match.params.id} /> }/>
              <Route exact path="/user/review/:id" render={({ match }) =>  <CrudReview key={match.params.id} id={match.params.id} /> } />
              
              <PrivateRoute exact path='/admin/discount' component={GlobalDiscount}/>
    
              <PrivateRoute exact path='/admin/products' component={CrudProduct} />
              <PrivateRoute exact path='/admin/categories' component={NewCategoryForm} />
              <PrivateRoute exact path="/admin/orders" component={OrderTable} />
              <PrivateRoute exact path="/admin/users" component={UserTable} />

              <Route exact path= "/checkOut" component= {CheckOut} />
              <Route exact path="/mercadopago/success" component={Success} />
              <Route exact path="/mercadopago/failed" component={Failed} />
              
              <Route exact path="/orders/:id" render={({ match }) =>  <OrderDetails key={match.params.id} id={match.params.id} /> } />
              <Route exact path="/users/:id/orders" render={({ match }) => <OrderDetails key={match.params.id} id={match.params.id} /> }/>
  
              <Route exact path='/selectStates' component={SelectStates} />

              <Route path='/auth/google/redirect'><GoogleLogin /></Route>
              <Route path='/auth/facebook/callback'><FacebookLogin /></Route>
              <Route path='/users/ordersTable'><UserOrdersTable/></Route>
            </div>
          </main>
        </div>
      </div>
      <footer>
        <Footer />
      </footer>
    </BrowserRouter >
  );
}

export default App;
