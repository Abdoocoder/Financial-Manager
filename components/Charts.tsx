import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import { CHART_COLORS } from '../utils/helpers';

interface DataPoint {
  name: string;
  value: number;
}

export const DonutChart: React.FC<{ data: DataPoint[] }> = ({ data }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => value.toLocaleString()}
            contentStyle={{ direction: 'rtl', textAlign: 'right', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const SimpleBarChart: React.FC<{ data: DataPoint[] }> = ({ data }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <YAxis hide />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ direction: 'rtl', textAlign: 'right', borderRadius: '8px' }}
          />
          <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const SimpleLineChart: React.FC<{ data: any[] }> = ({ data }) => {
    return (
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
            <Tooltip 
              contentStyle={{ direction: 'rtl', textAlign: 'right', borderRadius: '8px' }}
            />
            <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };
