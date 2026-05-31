import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Home from './routes/Home.tsx';
import Lesson from './routes/Lesson.tsx';
import Progress from './routes/Progress.tsx';
import Settings from './routes/Settings.tsx';
import NotFound from './routes/NotFound.tsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="lesson/:lessonId" element={<Lesson />} />
        <Route path="progress" element={<Progress />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
