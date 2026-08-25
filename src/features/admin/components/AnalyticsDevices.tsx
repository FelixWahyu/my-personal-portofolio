import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getDevices } from "../../../services/analyticsService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#6366f1", "#ec4899", "#8b5cf6"];

export const AnalyticsDevices = () => {
  const [period, setPeriod] = useState("30d");
  const [devicesData, setDevicesData] = useState<any[]>([]);
  const [browsersData, setBrowsersData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getDevices(period);
        if (res.success && res.data) {
          const formattedDevices = (res.data.devices?.data || []).map((item: any) => ({
            name: item.deviceType || "Unknown",
            value: item.pageviews || 0,
          }));
          const formattedBrowsers = (res.data.browsers?.data || []).map((item: any) => ({
            name: item.browserName || "Unknown",
            value: item.pageviews || 0,
          }));
          
          setDevicesData(formattedDevices);
          setBrowsersData(formattedBrowsers);
        }
      } catch (error) {
        console.error("Failed to fetch device data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  const renderPieChart = (data: any[], noDataMsg: string) => {
    if (loading) {
      return <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">Memuat data...</div>;
    }
    if (data.length === 0) {
      return <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">{noDataMsg}</div>;
    }
    
    return (
      <div className="h-[250px] mt-4 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
              itemStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "12px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-medium">Device & Browser</CardTitle>
          <CardDescription>Platform pengunjung</CardDescription>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[100px] h-8 text-xs">
            <SelectValue placeholder="Periode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 Hari</SelectItem>
            <SelectItem value="14d">14 Hari</SelectItem>
            <SelectItem value="30d">30 Hari</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="device" className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="device">Device</TabsTrigger>
            <TabsTrigger value="browser">Browser</TabsTrigger>
          </TabsList>
          <TabsContent value="device" className="mt-0">
            {renderPieChart(devicesData, "Tidak ada data device")}
          </TabsContent>
          <TabsContent value="browser" className="mt-0">
            {renderPieChart(browsersData, "Tidak ada data browser")}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AnalyticsDevices;
