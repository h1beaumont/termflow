import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface ConversionFunnelChartProps {
  data: any[];
  beforeKey?: string;
  afterKey?: string;
  stageKey?: string;
  title?: string;
}

export function ConversionFunnelChart({ 
  data, 
  beforeKey = 'before',
  afterKey = 'after',
  stageKey = 'stage',
  title 
}: ConversionFunnelChartProps) {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart 
          data={data} 
          layout="vertical"
          margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            type="number"
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--foreground))' }}
          />
          <YAxis 
            type="category"
            dataKey={stageKey}
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--foreground))' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Bar 
            dataKey={beforeKey} 
            name="Before TermFlow"
            fill="hsl(var(--tf-slate))" 
            radius={[0, 4, 4, 0]}
          />
          <Bar 
            dataKey={afterKey} 
            name="After TermFlow"
            fill="hsl(var(--tf-lime))" 
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
