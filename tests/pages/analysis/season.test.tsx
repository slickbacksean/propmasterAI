// src/tests/pages/analysis/Season.test.tsx
import React from 'react';
import { render, screen, waitFor } from '../../utils/test-utils';
import userEvent from '@testing-library/user-event';
import SeasonPage from '../../../pages/analysis/Season';
import { QueryClient, QueryClientProvider } from 'react-query';

// Mock the useSeasonalAnalysis hook
jest.mock('../../../hooks/useSeasonalAnalysis', () => ({
  useSeasonalAnalysis: () => ({
    fetchSeasonalPlayers: jest.fn().mockResolvedValue([
      { id: '1', name: 'LeBron James', team: 'LA Lakers' },
      { id: '2', name: 'Stephen Curry', team: 'Golden State Warriors' }
    ]),
    calculateSeasonalPerformance: jest.fn().mockResolvedValue({
      projectedPoints: 250.5,
      performanceTrend: 0.75,
      monthlyBreakdown: [
        { name: 'Jan', averagePerformance: 22.3 },
        { name: 'Feb', averagePerformance: 24.1 }
      ]
    })
  })
}));

describe('SeasonPage Component', () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    render(
      <QueryClientProvider client={queryClient}>
        <SeasonPage />
      </QueryClientProvider>
    );
  });

  it('renders the page title', () => {
    expect(screen.getByText('Seasonal Prop Predictor')).toBeInTheDocument();
  });

  it('displays sport selection buttons', () => {
    const sports = ['Basketball', 'Football', 'Baseball', 'Soccer'];
    sports.forEach(sport => {
      expect(screen.getByText(sport)).toBeInTheDocument();
    });
  });

  it('loads players when a sport is selected', async () => {
    await waitFor(() => {
      expect(screen.getByText('LeBron James - LA Lakers')).toBeInTheDocument();
      expect(screen.getByText('Stephen Curry - Golden State Warriors')).toBeInTheDocument();
    });
  });

  it('shows player seasonal performance when selected', async () => {
    const user = userEvent.setup();
    
    // Wait for players to load and select LeBron James
    await waitFor(() => {
      const playerElement = screen.getByText('LeBron James - LA Lakers');
      user.click(playerElement);
    });

    // Check performance details
    await waitFor(() => {
      expect(screen.getByText('Projected Total Points')).toBeInTheDocument();
      expect(screen.getByText('250.5')).toBeInTheDocument();
      expect(screen.getByText('▲ Improving')).toBeInTheDocument();
    });
  });
});