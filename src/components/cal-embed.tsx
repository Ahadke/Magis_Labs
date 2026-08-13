import { useEffect } from "react";

const CAL_LINK = "austin-pereira-f5qmwb/15min";
const NAMESPACE = "15min";

declare global {
  interface Window {
    Cal?: any;
  }
}

/** Inline Cal.com booking widget. */
export function CalEmbed({ className = "" }: { className?: string }) {
  useEffect(() => {
    const C = window as any;
    (function (C: any, A: string, L: string) {
      const p = function (a: any, ar: any) {
        a.q.push(ar);
      };
      const d = C.document;
      C.Cal =
        C.Cal ||
        function (...args: any[]) {
          const cal = C.Cal;
          const ar = args;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api = function (...inner: any[]) {
              p(api, inner);
            };
            const namespace = ar[1];
            (api as any).q = (api as any).q || [];
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["initNamespace", namespace]);
            } else {
              p(cal, ar);
            }
            return;
          }
          p(cal, ar);
        };
    })(C, "https://app.cal.com/embed/embed.js", "init");

    C.Cal("init", NAMESPACE, { origin: "https://app.cal.com" });
    C.Cal.config = C.Cal.config || {};
    C.Cal.config.forwardQueryParams = true;
    C.Cal.ns[NAMESPACE]("inline", {
      elementOrSelector: "#magis-cal-inline",
      config: { layout: "month_view", useSlotsViewOnSmallScreen: "true" },
      calLink: CAL_LINK,
    });
    C.Cal.ns[NAMESPACE]("ui", {
      hideEventTypeDetails: false,
      layout: "month_view",
    });
  }, []);

  return (
    <div
      id="magis-cal-inline"
      className={className}
      style={{ width: "100%", minHeight: "720px" }}
    />
  );
}
