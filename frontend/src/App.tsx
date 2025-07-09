import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Welcome from './pages/Welcome';
import AuthForm from './pages/Authform';



const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route
          path="/welcome"
          element={
           
              <Welcome />
          
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
