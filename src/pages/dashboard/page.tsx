import { AppShell } from "../../components/feature/AppShell";
import { KPICards } from "./components/KPICards";
import { StatusOverview } from "./components/StatusOverview";
import { AttentionSection } from "./components/AttentionSection";
import { LivePipeline } from "./components/LivePipeline";
import { useOrders } from "../../context/OrdersContext";

export default function DashboardPage() {
  const { orders } = useOrders();
  const urgentCount = orders.filter(o => o.isUrgent || o.isDelayed).length;

  return (
    <AppShell>
      <div className="p-5 space-y-4 min-w-0">

        {/* ── Shift bar ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between bg-gray-950 text-white rounded-xl px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse block flex-shrink-0" />
            <div>
              <span className="text-sm font-bold">Morning Shift</span>
              <span className="text-gray-500 text-xs ml-3">06:00 – 14:00</span>
              <span className="text-gray-500 text-xs ml-3">F&amp;B Supervisor: Nina Osei</span>
            </div>
          </div>
          <div className="flex items-center gap-5 text-sm">
            <div>
              <span className="text-gray-500 text-xs mr-1.5">Rooms Active</span>
              <span className="font-black text-white">142/163</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div>
              <span className="text-gray-500 text-xs mr-1.5">Orders</span>
              <span className="font-black text-white">{orders.length}</span>
            </div>
            {urgentCount > 0 && (
              <>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-1.5">
                  <i className="ri-alarm-warning-fill text-red-400 text-sm" />
                  <span className="font-black text-red-400">{urgentCount} need attention</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── 1. Metrics (6 cards) ───────────────────────────────── */}
        <section>
          <KPICards />
        </section>

        {/* ── 2 + 3. Status Overview + Attention ────────────────── */}
        <section className="grid grid-cols-5 gap-4">
          <div className="col-span-2">
            <StatusOverview />
          </div>
          <div className="col-span-3">
            <AttentionSection />
          </div>
        </section>

        {/* ── 4. Active Pipeline ─────────────────────────────────── */}
        <section>
          <LivePipeline />
        </section>

      </div>
    </AppShell>
  );
}
