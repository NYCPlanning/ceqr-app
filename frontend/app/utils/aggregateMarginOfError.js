export default function aggregateMarginOfError(moes) {
  return Math.sqrt(
    moes.reduce((summedSquares, moe) => summedSquares + Math.pow(moe, 2))
  );
}
