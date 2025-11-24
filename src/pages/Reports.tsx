import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportService } from '@/services/reports';
import { Loading } from '@/components/Loading';
import { formatCurrency } from '@/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Input } from '@/components/FormFields';

type ChartRow = {
  month: string;
  totalValue: number;
  quantity: number;
};

export const Reports = () => {
  const [startDate, setStartDate] = useState(format(startOfMonth(subMonths(new Date(), 5)), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['reports', 'monthly-consumption', startDate, endDate],
    queryFn: () => reportService.getMonthlyConsumption(startDate, endDate),
  });

  // Transform data for chart
  const chartData =
    reportData?.reduce<ChartRow[]>((acc, item) => {
      const existing = acc.find((d) => d.month === item.month);
      if (existing) {
        existing.totalValue += item.totalValue;
        existing.quantity += item.quantity;
      } else {
        acc.push({
          month: item.month,
          totalValue: item.totalValue,
          quantity: item.quantity,
        });
      }
      return acc;
    }, []) || [];

  const handleExport = () => {
    if (!reportData) return;

    const csv = [
      ['Month', 'Product', 'Quantity', 'Total Value'],
      ...reportData.map((item) => [
        item.month,
        item.productName,
        item.quantity,
        item.totalValue,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consumption-report-${startDate}-${endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">Monthly consumption and sales reports</p>
        </div>
        <button onClick={handleExport} className="btn btn-primary" disabled={!reportData}>
          Export CSV
        </button>
      </div>

      <div className="card">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Input
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <>
            {chartData.length > 0 ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">Monthly Consumption Value</h2>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="totalValue" fill="#22c55e" name="Total Value (₹)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-4">Monthly Consumption Quantity</h2>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="quantity" fill="#3b82f6" name="Quantity" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No data available for the selected date range</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

