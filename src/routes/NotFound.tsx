import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="flex flex-col items-center gap-4 text-center">
      <h1 className="text-3xl font-bold">404 — Siden blev ikke fundet</h1>
      <Link to="/" className="font-medium text-indigo-600 hover:underline">
        Tilbage til forsiden
      </Link>
    </section>
  );
}
