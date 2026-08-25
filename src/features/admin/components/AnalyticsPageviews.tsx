import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getPageviews } from "../../../services/analyticsService";

export const AnalyticsPageviews = () => {
  const [period, setPeriod] = useState("7d");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getPageviews(period);
        if (res.success && res.data) {
          // Format data for Recharts
          const formatted = (res.data.data || []).map((item: any) => ({
            date: new Date(item.timestamp).toLocaleDateString("id-ID", { month: "short", day: "numeric" }),
            views: item.pageviews || 0,
          }));
          // Vercel returns data sorted by time already (oldest first or newest first, usually chronological)
          // Based on the test, it's oldest first, so no need to reverse, or check first.
          setData(formatted);
        }
      } catch (error) {
        console.error("Failed to fetch pageviews", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  const totalViews = data.reduce((acc, item) => acc + item.views, 0);

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-medium">Kunjungan Website</CardTitle>
          <CardDescription>Total pageviews untuk periode terpilih: <strong className="text-foreground">{totalViews}</strong></CardDescription>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Pilih Periode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 Hari</SelectItem>
            <SelectItem value="14d">14 Hari</SelectItem>
            <SelectItem value="30d">30 Hari</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">Memuat data...</div>
        ) : data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">Tidak ada data untuk periode ini</div>
        ) : (
          <div className="h-[300px] mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} 
                  dy={10}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                  itemStyle={{ color: "hsl(var(--primary))" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  name="Pageviews"
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: "hsl(var(--primary))" }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsPageviews;
