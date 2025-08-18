import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { year: 2016, value: 40 },
  { year: 2018, value: 55 },
  { year: 2020, value: 75 },
  { year: 2022, value: 90 },
  { year: 2028, value: 120 },
];

export default function AnalyticsCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      <h2 className="font-bold mb-2">Predictive Analytics</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
