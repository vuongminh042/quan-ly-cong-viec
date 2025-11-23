import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TaskAreaChartProps {
  data: Array<{
    date: string;
    tasks: number;
  }>;
}

const TaskAreaChart = ({ data }: TaskAreaChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#764ba2" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
        <XAxis 
          dataKey="date" 
          stroke="rgba(255, 255, 255, 0.7)"
          style={{ fontSize: '11px' }}
        />
        <YAxis 
          stroke="rgba(255, 255, 255, 0.7)"
          style={{ fontSize: '11px' }}
        />
        <Tooltip 
          contentStyle={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Area 
          type="monotone" 
          dataKey="tasks" 
          stroke="#667eea" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorTasks)"
          name="Công việc"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TaskAreaChart;
