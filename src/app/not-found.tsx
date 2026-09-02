import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrap py-20">
      <p className="page-kicker">404</p>
      <h1 className="page-title">This page is not on the board</h1>
      <p className="mb-6 max-w-46ch text-(--dim)">
        The URL does not match a meetup page. Head home or jump to registration.
      </p>
      <div className="flex flex-wrap gap-2.5">
        <Link href="/" className="btn btn-primary">
          Home
        </Link>
        <Link href="/register" className="btn btn-secondary">
          Register
        </Link>
      </div>
    </main>
  );
}
