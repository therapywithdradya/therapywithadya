import { filled, site } from "@/content/site";

type PolicyRow = {
  key: string;
  label: string;
  value: string | undefined;
};

const pendingCopy = "[DUMMY] Policy text pending client confirmation";

function noticeHours(hours: number): string | undefined {
  if (!Number.isInteger(hours) || hours < 0) {
    return undefined;
  }
  return hours === 1 ? "1 hour" : `${hours} hours`;
}

function yesNo(value: boolean): string {
  return value ? "Available on this site" : "Not available on this site";
}

/**
 * Add a policy field by appending one row here. Empty strings are omitted.
 * Boolean fields are shown when the policy is confirmed, including false.
 */
function confirmedPolicyRows(): PolicyRow[] {
  const policies = site.policies;
  const rows: PolicyRow[] = [
    {
      key: "paymentTerms",
      label: "Payment",
      value: filled(policies.paymentTerms) ? policies.paymentTerms.trim() : undefined,
    },
    {
      key: "cancellationNoticeHours",
      label: "Cancellation notice",
      value: noticeHours(policies.cancellationNoticeHours),
    },
    {
      key: "selfServeCancel",
      label: "Self-serve cancellation",
      value: yesNo(policies.selfServeCancel),
    },
    {
      key: "selfServeReschedule",
      label: "Self-serve rescheduling",
      value: yesNo(policies.selfServeReschedule),
    },
  ];

  return rows.filter((row) => row.value !== undefined);
}

/**
 * Sections definition for /terms-and-cancellation.
 * Adding another policy later means adding one field to site.policies and one row here.
 */
type PolicySectionDef = {
  key: string;
  heading: string;
  getValue: (policies: typeof site.policies) => string | undefined;
};

const policySections: PolicySectionDef[] = [
  {
    key: "payment",
    heading: "Payment",
    getValue: (p) => (filled(p.paymentTerms) ? p.paymentTerms.trim() : undefined),
  },
  {
    key: "cancellation",
    heading: "Cancellation and refunds",
    getValue: (p) => {
      const parts: string[] = [];
      const notice = noticeHours(p.cancellationNoticeHours);
      if (notice) parts.push(`Notice: ${notice}`);
      if (filled(p.refundSummary)) parts.push(p.refundSummary.trim());
      return parts.length > 0 ? parts.join(". ") : undefined;
    },
  },
  {
    key: "rescheduling",
    heading: "Rescheduling",
    getValue: (p) => (filled(p.reschedulingSummary) ? p.reschedulingSummary.trim() : undefined),
  },
  {
    key: "minors",
    heading: "Under-18s",
    getValue: (p) => (filled(p.minorsSummary) ? p.minorsSummary.trim() : undefined),
  },
];

export function PolicySummary({
  headingId = "policy-summary-title",
  mode = "table",
}: {
  headingId?: string;
  mode?: "table" | "sections";
}) {
  const confirmed = site.policies.confirmed;

  if (mode === "sections") {
    return (
      <div className="space-y-8">
        {policySections.map((section) => {
          const sectionHeadingId = `policy-section-${section.key}`;

          if (!confirmed) {
            return (
              <div key={section.key} className="min-w-0">
                <h3
                  id={sectionHeadingId}
                  className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
                >
                  {section.heading}
                </h3>
                <p className="mt-3 max-w-[70ch] text-muted [overflow-wrap:anywhere]">
                  [DUMMY] Pending client confirmation
                </p>
              </div>
            );
          }

          const val = section.getValue(site.policies);
          if (!val) {
            return null;
          }

          return (
            <div key={section.key} className="min-w-0">
              <h3
                id={sectionHeadingId}
                className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
              >
                {section.heading}
              </h3>
              <p className="mt-3 max-w-[70ch] text-muted [overflow-wrap:anywhere]">
                {val}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  // mode === "table" (kept untouched for /sessions)
  const rows = confirmed ? confirmedPolicyRows() : [];

  return (
    <div>
      <h2
        id={headingId}
        className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
      >
        Policies
      </h2>
      {confirmed ? (
        rows.length > 0 ? (
          <dl className="mt-6 max-w-[70ch] space-y-4">
            {rows.map((row) => (
              <div key={row.key} className="min-w-0">
                <dt className="font-semibold text-ink">{row.label}</dt>
                <dd className="text-muted [overflow-wrap:anywhere]">{row.value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-4 max-w-[70ch] text-muted">No policy details are published yet.</p>
        )
      ) : (
        <p className="mt-4 max-w-[70ch] text-muted [overflow-wrap:anywhere]">{pendingCopy}</p>
      )}
    </div>
  );
}
