import { filled, site } from "@/content/site";
import type { EditableSiteContent } from "@/lib/site-content-types";

type PolicyConfig = EditableSiteContent["legalAndSafety"]["policies"];

type PolicyRow = {
  key: string;
  label: string;
  value: string | undefined;
};

const pendingCopy = "Policy text pending confirmation";

function noticeHours(hours: number): string | undefined {
  if (!Number.isInteger(hours) || hours < 0) {
    return undefined;
  }
  return hours === 1 ? "1 hour" : `${hours} hours`;
}

function yesNo(value: boolean): string {
  return value ? "Available on this site" : "Not available on this site";
}

function confirmedPolicyRows(policies: PolicyConfig): PolicyRow[] {
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

type PolicySectionDef = {
  key: string;
  heading: string;
  getValue: (policies: PolicyConfig) => string | undefined;
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
  policies,
}: {
  headingId?: string;
  mode?: "table" | "sections";
  policies?: PolicyConfig;
}) {
  const resolvedPolicies: PolicyConfig = policies ?? { ...site.policies };
  const confirmed = resolvedPolicies.confirmed;

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
                  Pending client confirmation
                </p>
              </div>
            );
          }

          const val = section.getValue(resolvedPolicies);
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

  const rows = confirmed ? confirmedPolicyRows(resolvedPolicies) : [];

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
