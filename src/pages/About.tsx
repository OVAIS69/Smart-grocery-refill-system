const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-neutral-100 bg-white/80 p-4 shadow-sm">
    <p className="text-xs uppercase tracking-wide text-neutral-400">{label}</p>
    <p className="mt-1 text-lg font-semibold text-neutral-900">{value}</p>
  </div>
);

export const About = () => {
  return (
    <div className="space-y-8">
      <section className="card border-none bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white shadow-card">
        <p className="text-xs uppercase tracking-[0.4em] text-white/70">Project dossier</p>
        <h1 className="mt-3 text-3xl font-semibold">Smart Grocery Refill System</h1>
        <p className="mt-3 text-sm text-white/80">
          Submitted in partial fulfilment of the requirements for the award of the Degree of Bachelor of Science
          (Information Technology).
        </p>
        <p className="text-sm text-white/80">Vidyalanakar School of Information Technology, University of Mumbai.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <InfoRow label="Academic Year" value="2025 – 2026" />
        <InfoRow label="Institution" value="Vidyalanakar School of Information Technology" />
        <InfoRow label="City" value="Mumbai, Maharashtra – 400037" />
        <InfoRow label="Guide" value="Mrs. Swarupa Gogate (Assistant Professor, Dept. of IT)" />
        <InfoRow label="Seat Number (Lead)" value="_________________" />
        <div className="rounded-2xl border border-neutral-100 bg-white/80 p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-neutral-400">Project Team</p>
          <ul className="mt-2 space-y-1 text-sm font-semibold text-neutral-900">
            <li>• Candidate 1: Asifali Shaikh</li>
            <li>• Candidate 2: Shahina Shaikh</li>
            <li>• Candidate 3: Neha Ansari</li>
          </ul>
        </div>
      </section>

      <section className="card space-y-4">
        <h2 className="text-2xl font-semibold text-neutral-900">Abstract</h2>
        <p className="text-sm leading-relaxed text-neutral-600">
          The Smart Grocery Refill System automates inventory tracking for large retail chains such as DMart,
          ensuring that every store location maintains the right quantity of essential products. Manual stock
          tracking is error-prone and often causes stockouts, overstocking, and high operational overheads. Our
          platform continuously monitors product counts, compares them to configurable thresholds, and alerts the
          store manager and supplier whenever replenishment is required. Role-based dashboards for Admin, Store
          Manager, and Supplier make it easier to govern catalogues, approvals, and fulfilment status, while
          automated notifications reduce manual effort. Analytics and reporting modules transform raw operational
          data into insights that improve forecasting, cut waste, and elevate customer satisfaction.
        </p>
      </section>

      <section className="card space-y-4">
        <h2 className="text-2xl font-semibold text-neutral-900">Acknowledgement</h2>
        <p className="text-sm leading-relaxed text-neutral-600">
          I express my sincere gratitude to Mrs. Swarupa Gogate for invaluable mentoring throughout the completion
          of the Smart Grocery Refill System. I am also thankful to Vidyalanakar School of Information Technology
          for providing the resources and lab support necessary to deliver this solution. Finally, heartfelt thanks
          to the faculty members of the Department of Information Technology for their continuous encouragement,
          insights, and timely reviews.
        </p>
      </section>

      <section className="card space-y-3">
        <h2 className="text-2xl font-semibold text-neutral-900">Declaration</h2>
        <p className="text-sm leading-relaxed text-neutral-600">
          I hereby declare that the project entitled “Smart Grocery Refill System”, completed at Vidyalanakar School
          of Information Technology, is original, has not been submitted elsewhere for any other degree, and fulfils
          the requirements of the Bachelor of Science (Information Technology) programme.
        </p>
        <p className="text-sm font-semibold text-neutral-700">— Asifali Shaikh</p>
      </section>

      <section className="card space-y-4">
        <h2 className="text-2xl font-semibold text-neutral-900">Project Highlights</h2>
        <ul className="grid gap-3 text-sm text-neutral-600 md:grid-cols-2">
          <li className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-3">
            Automated low-stock detection with instant alerts to store managers and suppliers.
          </li>
          <li className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-3">
            Role-specific dashboards for Admin, Store Manager, and Supplier to streamline collaboration.
          </li>
          <li className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-3">
            Order orchestration module with manual overrides and smart scheduling.
          </li>
          <li className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-3">
            Comprehensive reporting suite covering consumption trends, refill history, and SLA tracking.
          </li>
        </ul>
      </section>
    </div>
  );
};

