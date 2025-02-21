import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { emotion: 'Happy', value: 0.8 },
  { emotion: 'Sad', value: 0.2 },
  { emotion: 'Angry', value: 0.1 },
  { emotion: 'Surprised', value: 0.4 },
  { emotion: 'Neutral', value: 0.6 },
];

export function EmotionChart() {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="emotion" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="hsl(var(--primary))" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}