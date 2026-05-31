import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Home from './routes/Home.tsx';
import Lessons from './routes/Lessons.tsx';
import Lesson from './routes/Lesson.tsx';
import Practice from './routes/Practice.tsx';
import Progress from './routes/Progress.tsx';
import Settings from './routes/Settings.tsx';
import NotFound from './routes/NotFound.tsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="lessons" element={<Lessons />} />
        <Route path="lesson/:lessonId" element={<Lesson />} />
        <Route path="practice" element={<Practice />} />
        <Route path="progress" element={<Progress />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
