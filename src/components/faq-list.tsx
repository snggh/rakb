import { faqs } from "@/content/faqs";

export function FaqList() {
  return (
    <div>
      {faqs.map((item) => (
        <details key={item.q} className="faq-item">
          <summary>
            <span>{item.q}</span>
            <span className="faq-plus" aria-hidden>
              +
            </span>
          </summary>
          <p className="faq-answer m-0 max-w-[62ch] pb-5 text-sm leading-[1.65] text-[var(--dim)]">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
