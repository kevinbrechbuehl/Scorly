using System;

namespace Scorly.Infrastructure.Api.Dtos
{
    public class MatchDto : EntityBaseDto
    {
        public DateTime StartTime { get; set; }
        
        public string Player1 { get; set; }

        public string Player2 { get; set; }

        public GameDto Game1 { get; set; } = new GameDto();

        public GameDto Game2 { get; set; } = new GameDto();

        public GameDto Game3 { get; set; } = new GameDto();

        public GameDto Game4 { get; set; } = new GameDto();

        public GameDto Game5 { get; set; } = new GameDto();
    }
}
