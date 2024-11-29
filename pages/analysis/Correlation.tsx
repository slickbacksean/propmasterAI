import React, { useState, useEffect } from 'react';
import { CorrelationView } from '../../components/analysis/CorrelationView';
import { useCorrelationAnalysis } from '../../hooks/useCorrelationAnalysis';
import { CorrelationMatrix } from '../../components/common/charts/CorrelationMatrix';

interface CorrelationData {
  sport: string;
  metrics: string[];
  correlationMatrix: number[][];
}

const CorrelationPage: React.FC = () => {
  const [selectedSport, setSelectedSport] = useState<string>('basketball');
  const [correlationData, setCorrelationData] = useState<CorrelationData | null>(null);

  const { fetchCorrelations } = useCorrelationAnalysis();

  useEffect(() => {
    const loadCorrelations = async () => {
      try {
        const data = await fetchCorrelations(selectedSport);
        setCorrelationData(data);
      } catch (error) {
        console.error('Error loading correlations:', error);
      }
    };

    loadCorrelations();
  }, [selectedSport, fetchCorrelations]);

  const sportOptions = ['basketball', 'football', 'baseball', 'soccer'];

  return (
    <div className="correlation-analysis-container">
      <h1 className="text-2xl font-bold mb-6">Multi-Variable Correlation Analysis</h1>

      <div className="sport-selector mb-6">
        <label className="block mb-2 font-semibold">Select Sport:</label>
        <div className="flex space-x-4">
          {sportOptions.map(sport => (
            <button
              key={sport}
              className={`px-4 py-2 rounded ${
                selectedSport === sport 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setSelectedSport(sport)}
            >
              {sport.charAt(0).toUpperCase() + sport.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="correlation-matrix">
          <h2 className="text-xl font-semibold mb-4">Correlation Matrix</h2>
          {correlationData ? (
            <CorrelationMatrix 
              metrics={correlationData.metrics}
              matrix={correlationData.correlationMatrix}
            />
          ) : (
            <div className="text-center text-gray-500 py-10">
              <p>Loading correlation data...</p>
            </div>
          )}
        </div>

        <div className="correlation-insights">
          <h2 className="text-xl font-semibold mb-4">Insights</h2>
          {correlationData && (
            <CorrelationView 
              sport={selectedSport}
              metrics={correlationData.metrics}
              correlationMatrix={correlationData.correlationMatrix}
            />
          )}
        </div>
      </div>

      <div className="advanced-analysis mt-8">
        <h3 className="text-lg font-semibold mb-4">Advanced Correlation Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded">
            <h4 className="font-bold mb-2">Top Correlations</h4>
            {/* Placeholder for top correlation details */}
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <h4 className="font-bold mb-2">Weak Correlations</h4>
            {/* Placeholder for weak correlation details */}
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <h4 className="font-bold mb-2">Anomalies</h4>
            {/* Placeholder for correlation anomalies */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrelationPage;