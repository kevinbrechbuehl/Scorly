using System;

namespace Scorly.Infrastructure.Api.Dtos
{
    public class MatchDto : EntityBaseDto
    {
        public string Player1Name { get; set; }

        public int Player1Score { get; set;}

        public string Player2Name { get; set; }

        public int Player2Score { get; set; }

        public DateTime StartTime { get; set; }
    }
}
