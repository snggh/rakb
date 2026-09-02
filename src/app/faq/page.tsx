import type { Metadata } from "next";
import { FaqList } from "@/components/faq-list";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Questions we keep getting about Ruang Aksara Keyboard meetups.",
};

export default function FaqPage() {
  return (
    <main>
      <section className="wrap wrap-faq pt-16 pb-20">
        <p className="page-kicker">FAQ</p>
        <h1 className="page-title mb-9">Questions we keep getting</h1>
        <FaqList />
      </section>
    </main>
  );
}
