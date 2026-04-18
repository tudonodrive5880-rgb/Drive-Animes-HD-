import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Post } from './pages/Post';
import { MyList } from './pages/MyList';
import { Search } from './pages/Search';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="catalog/:type" element={<Catalog />} />
            <Route path="mylist" element={<MyList />} />
            <Route path="search" element={<Search />} />
            <Route path="post/:id" element={<Post />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

