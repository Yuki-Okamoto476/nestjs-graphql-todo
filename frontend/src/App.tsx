import { ApolloProvider } from '@apollo/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { GuestRoute, PrivateRoute } from './AuthRoute';
import Main from './pages/Main';
import NotFound from './pages/NotFound';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import client from './apolloClient';

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
      <Routes>
        <Route path='/signin' element={<GuestRoute children={<SignIn />}/>} />
        <Route path='/signup' element={<GuestRoute children={<SignUp />}/>} />
        <Route path='/' element={<PrivateRoute children={<Main />}/>} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
