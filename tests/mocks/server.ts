// src/tests/mocks/server.ts
import { setupServer } from 'msw/node';
import { rest } from 'msw';

// API Endpoint Mocks
export const handlers = [
  // Player Data Mock
  rest.get('/api/players', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        players: [
          { 
            id: '1', 
            name: 'LeBron James', 
            sport: 'basketball', 
            team: 'LA Lakers' 
          },
          { 
            id: '2', 
            name: 'Tom Brady', 
            sport: 'football', 
            team: 'Tampa Bay Buccaneers' 
          }
        ]
      })
    );
  }),

  // Seasonal Performance Mock
  rest.get('/api/players/:playerId/seasonal-performance', (req, res, ctx) => {
    const { playerId } = req.params;
    
    return res(
      ctx.status(200),
      ctx.json({
        playerId,
        projectedPoints: 250.5,
        performanceTrend: 0.75,
        monthlyBreakdown: [
          { month: 'Jan', averagePerformance: 22.3 },
          { month: 'Feb', averagePerformance: 24.1 }
        ]
      })
    );
  }),

  // Generic Error Handler
  rest.get('*', (req, res, ctx) => {
    console.warn(`Unhandled request to: ${req.url.toString()}`);
    return res(
      ctx.status(500),
      ctx.json({ error: 'Unhandled request' })
    );
  })
];

// Setup mock service worker
export const server = setupServer(...handlers);