import { GameDto, MatchDto } from '../api/client';

export class MatchExtensions {
  public static isRunning(match: MatchDto): boolean {
    return (
      (match.game1.player1Score > 0 || match.game1.player2Score > 0) &&
      !MatchExtensions.isFinished(match)
    );
  }

  public static isFinished(match: MatchDto): boolean {
    return (
      MatchExtensions.isMatchWinner(match, 1) ||
      MatchExtensions.isMatchWinner(match, 2)
    );
  }

  public static isGameWinner(game: GameDto, player: number): boolean {
    const actualScore = game['player' + player + 'Score'];
    const otherScore = game['player' + (player === 1 ? 2 : 1) + 'Score'];

    return (
      actualScore > otherScore &&
      actualScore >= 11 &&
      actualScore - otherScore >= 2
    );
  }

  public static isMatchWinner(match: MatchDto, player: number): boolean {
    let winningGames = 0;

    for (let i = 1; i <= 5; i++) {
      if (MatchExtensions.isGameWinner(match['game' + i], player)) {
        winningGames++;
      }
    }

    return winningGames >= 3;
  }
}
