import type { Metadata } from "next";
import { rundown, scheduleDraft, scheduleNote } from "@/content/schedule";

export const metadata: Metadata = {
  title: "Schedule",
  description: "Run of the day for Ruang Aksara Keyboard Meetup Vol. 2.",
};

export default function SchedulePage() {
  return (
    <main>
      <section className="wrap pt-16 pb-20">
        <p className="page-kicker">Schedule</p>
        <h1 className="page-title">Run of the day</h1>
        <p className="mb-3.5 max-w-[56ch] text-[var(--dim)]">{scheduleNote}</p>
        {scheduleDraft ? (
          <p className="mb-8">
            <span className="tag tag-outline">Draft — not final</span>
          </p>
        ) : null}
        <div className="panel table-shell">
          <table className="table">
            <thead>
              <tr>
                <th className="w-[110px]">Time</th>
                <th>Session</th>
                <th className="w-[170px]">Room</th>
              </tr>
            </thead>
            <tbody>
              {rundown.map((row) => (
                <tr key={row.time + row.title}>
                  <td className="font-mono text-[13px] text-[var(--color-text)]">{row.time}</td>
                  <td>
                    <div className="font-medium">{row.title}</div>
                    <div className="text-[12.5px] text-[var(--dimmer)]">{row.note}</div>
                  </td>
                  <td className="text-[13px] text-[var(--dim)]">{row.room}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
