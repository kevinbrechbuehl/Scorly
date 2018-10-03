namespace Scorly.Infrastructure.Api.Dtos
{
    public class GameDto : EntityBaseDto
    {
        public int Player1Score { get; set; }

        public int Player2Score { get; set; }
    }
}