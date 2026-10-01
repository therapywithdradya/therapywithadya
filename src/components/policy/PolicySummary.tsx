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

export function PolicySummary({
  headingId = "policy-summary-title",
}: {
  headingId?: string;
}) {
  const confirmed = site.policies.confirmed;
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
