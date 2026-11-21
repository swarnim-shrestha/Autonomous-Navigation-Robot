export default function ActivityLog({ log }) {
  return (
    <section className="panel">
      <h2>Activity</h2>
      <ul className="log">
        {log.length === 0 && <li>No activity yet.</li>}
        {log.map((l, i) => (
          <li key={i}>{l.t} <b>{l.m}</b></li>
        ))}
      </ul>
    </section>
  );
}
