import api from './backendConnection';

const leaderboardService = {
  getLeaderboard: (metric, period) => 
    api.get('leaderboard/get_leaderboard.php', {
      params: { metric, period }
    }).then(r => r.data)
};

export default leaderboardService;
