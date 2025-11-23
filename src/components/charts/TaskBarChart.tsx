import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TaskBarChartProps {
  data: Array<{
    name: string;
    completed: number;
    pending: number;
    overdue: number;
  }>;
}

const TaskBarChart = ({ data }: TaskBarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#43e97b" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#38f9d7" stopOpacity={0.8}/>
          </linearGradient>
          <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4facfe" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#00f2fe" stopOpacity={0.8}/>
          </linearGradient>
          <linearGradient id="colorOverdue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f093fb" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#f5576c" stopOpacity={0.8}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
        <XAxis 
          dataKey="name" 
          stroke="rgba(255, 255, 255, 0.7)"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="rgba(255, 255, 255, 0.7)"
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend 
          wrapperStyle={{ fontSize: '12px' }}
          iconType="circle"
        />
        <Bar 
          dataKey="completed" 
          fill="url(#colorCompleted)" 
          radius={[8, 8, 0, 0]}
          name="Hoàn thành"
        />
        <Bar 
          dataKey="pending" 
          fill="url(#colorPending)" 
          radius={[8, 8, 0, 0]}
          name="Đang làm"
        />
        <Bar 
          dataKey="overdue" 
          fill="url(#colorOverdue)" 
          radius={[8, 8, 0, 0]}
          name="Quá hạn"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TaskBarChart;
