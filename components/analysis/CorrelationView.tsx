import React, { useMemo } from 'react';

interface CorrelationData {
  metric: string;
  correlations: {
    [key: string]: number;
  };
}

interface CorrelationViewProps {
  data: CorrelationData[];
}

const CorrelationView: React.FC<CorrelationViewProps> = ({ data }) => {
  const processedData = useMemo(() => {
    const metrics = data.map(item => item.metric);
    
    return data.map(row => {
      const processedRow: { [key: string]: number } = { metric: row.metric };
      
      metrics.forEach(metric => {
        processedRow[metric] = row.correlations[metric] || 0;
      });
      
      return processedRow;
    });
  }, [data]);

  const getCorrelationColor = (value: number) => {
    if (value > 0.7) return '#2ecc71';   // Strong positive correlation
    if (value > 0.3) return '#27ae60';   // Moderate positive correlation
    if (value > 0) return '#2ecc71';     // Weak positive correlation
    if (value === 0) return '#95a5a6';   // No correlation
    if (value > -0.3) return '#e74c3c';  // Weak negative correlation
    if (value > -0.7) return '#c0392b';  // Moderate negative correlation
    return '#8e44ad';                    // Strong negative correlation
  };

  return (
    <div className="correlation-view p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Correlation Analysis</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2 text-left">Metric</th>
              {data[0] && Object.keys(data[0].correlations).map(metric => (
                <th key={metric} className="p-2 text-center">{metric}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t">
                <td className="p-2 font-semibold">{row.metric}</td>
                {Object.keys(row.correlations).map(metric => (
                  <td 
                    key={metric} 
                    className="p-2 text-center"
                    style={{ 
                      backgroundColor: getCorrelationColor(row.correlations[metric]),
                      color: 'white'
                    }}
                  >
                    {row.correlations[metric].toFixed(2)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CorrelationView;