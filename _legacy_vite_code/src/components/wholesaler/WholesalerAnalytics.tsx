import AnalyticsSummaryCard from './AnalyticsSummaryCard';

export default function WholesalerAnalytics() {
    // Mock Data for Analytics
    const METRICS = [
        { id: 1, title: 'Top Selling Products', value: 'Atta 10kg', subtext: 'Highest Revenue Generator', variant: 'blue' as const },
        { id: 2, title: 'Most Ordered Products', value: 'Sugar', subtext: 'Highest Order Volume', variant: 'green' as const },
        { id: 3, title: 'Won by Price', value: 'Tata Salt', subtext: 'Sold because cheapest in market', variant: 'purple' as const },
        { id: 4, title: 'Zero Sales', value: '5 Items', subtext: 'No orders in last 30 days', variant: 'orange' as const },
    ];

    return (
        <div className="bg-slate-50 min-h-screen pb-24">
            <div className="p-4 space-y-6">
                <h2 className="text-lg font-bold text-slate-800">Analytics</h2>

                <div className="space-y-3">
                    {METRICS.map((metric) => (
                        <AnalyticsSummaryCard
                            key={metric.id}
                            title={metric.title}
                            value={metric.value}
                            subtext={metric.subtext}
                            variant={metric.variant}
                            onClick={() => { }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
