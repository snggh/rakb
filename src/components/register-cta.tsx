import Link from "next/link";
import { event } from "@/content/event";

type RegisterCtaProps = {
  className?: string;
  children: React.ReactNode;
};

/**
 * Every "Register" button on the site. Points at the external ticketing page
 * once `event.ticketUrl` is set, and at /register until then.
 */
export function RegisterCta({ className, children }: RegisterCtaProps) {
  if (event.ticketUrl) {
    return (
      <a className={className} href={event.ticketUrl} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link className={className} href="/register">
      {children}
    </Link>
  );
}
