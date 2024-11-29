import React, { useState, useContext, useEffect } from 'react';
import { PropContext } from '../../contexts/PropContext';
import { CustomPropCard } from '../../components/builder/CustomPropCard';
import { Button } from '../../components/common/Button';

interface SavedProp {
  id: string;
  player: string;
  sport: string;
  statType: string;
  threshold: number;
  probability: number;
  odds: number;
  dateCreated?: Date;
}

const SavedPropsPage: React.FC = () => {
  const { 
    getSavedProps, 
    deleteProp, 
    updateProp 
  } = useContext(PropContext);

  const [savedProps, setSavedProps] = useState<SavedProp[]>([]);
  const [filterSport, setFilterSport] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'dateCreated' | 'probability'>('dateCreated');

  useEffect(() => {
    const loadSavedProps = async () => {
      const props = await getSavedProps();
      setSavedProps(props);
    };

    loadSavedProps();
  }, [getSavedProps]);

  const handleDeleteProp = async (propId: string) => {
    await deleteProp(propId);
    setSavedProps(prev => prev.filter(prop => prop.id !== propId));
  };

  const handleUpdateProp = async (updatedProp: SavedProp) => {
    const updated = await updateProp(updatedProp);
    setSavedProps(prev => 
      prev.map(prop => prop.id === updated.id ? updated : prop)
    );
  };

  const filteredAndSortedProps = savedProps
    .filter(prop => filterSport === 'All' || prop.sport === filterSport)
    .sort((a, b) => {
      if (sortBy === 'dateCreated') {
        return (b.dateCreated?.getTime() || 0) - (a.dateCreated?.getTime() || 0);
      }
      return b.probability - a.probability;
    });

  const uniqueSports = ['All', ...new Set(savedProps.map(prop => prop.sport))];

  return (
    <div className="saved-props-container">
      <h1 className="text-2xl font-bold mb-6">Saved Props</h1>

      <div className="filter-section mb-4 flex space-x-4">
        <div>
          <label className="block text-sm font-medium mb-2">Filter Sport:</label>
          <select 
            value={filterSport}
            onChange={(e) => setFilterSport(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {uniqueSports.map(sport => (
              <option key={sport} value={sport}>{sport}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Sort By:</label>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'dateCreated' | 'probability')}
            className="w-full p-2 border rounded"
          >
            <option value="dateCreated">Date Created</option>
            <option value="probability">Probability</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedProps.map(prop => (
          <CustomPropCard 
            key={prop.id} 
            prop={prop}
            onDelete={() => handleDeleteProp(prop.id)}
            onUpdate={handleUpdateProp}
          />
        ))}
      </div>

      {filteredAndSortedProps.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          <p>No saved props. Start building custom props!</p>
          <Button 
            onClick={() => {/* Navigate to custom prop builder */}}
            className="mt-4 bg-blue-500 text-white"
          >
            Create New Prop
          </Button>
        </div>
      )}
    </div>
  );
};

export default SavedPropsPage;