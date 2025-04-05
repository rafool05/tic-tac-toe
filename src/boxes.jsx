import { create } from "zustand";

const useGameStore = create((set) => ({
  curIdx: 0,
  history: [Array(9).fill(null)],
  setIdx: (nextIdx) => {
    set((state) => ({
      ...state,
      curIdx: nextIdx,
    }));
  },
  setHistory: (nextHistory) => {
    set((state) => ({
      ...state,
      squares: nextHistory,
    }));
  },
  clearHistory: () => {
    set(() => ({
      ...state,
      history: [Array(9).fill(null)],
      curIdx: 0,
    }));
  },
}));

function Square({ value, onSquareClick }) {
  return (
    <button
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        backgroundColor: "#fff",
        border: "1px solid #999",
        outline: 0,
        borderRadius: 0,
        fontSize: "1rem",
        fontWeight: "bold",
      }}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board() {
  function handleClick(i) {
    if (squares[i] || winner) return;
    const nextSquares = squares.slice();
    nextSquares[i] = curPlayer;
    history.splice(curIdx + 1);
    history[curIdx + 1] = nextSquares;
    setIdx(curIdx + 1);
    setHistory(history);
  }
  function calcWinner() {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    return lines.find(([a, b, c]) => {
      return (
        squares[a] && squares[a] === squares[b] && squares[a] === squares[c]
      );
    })
      ? isX
        ? "O"
        : "X"
      : null;
  }
  function statusTeller() {
    if (winner) return winner + " has won";
    if (!turns) return "Draw";
    return "next turn : " + curPlayer;
  }
  function undo() {
    if (!curIdx) return;
    setIdx(curIdx - 1);
  }
  function redo() {
    if (curIdx === history.length - 1) return;
    setIdx(curIdx + 1);
  }
  const { curIdx, history, setIdx, setHistory, clearHistory } = useGameStore();
  let squares = history[curIdx];
  const isX = curIdx % 2 == 0;
  const winner = calcWinner();
  const curPlayer = isX ? "X" : "O";
  const turns = squares.filter((square) => !square).length;
  const status = statusTeller();
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          width: "calc(3 * 2.5rem)",
          height: "calc(3 * 2.5rem)",
          border: "1px solid #999",
        }}
      >
        {squares.map((square, squareIndex) => (
          <Square
            key={squareIndex}
            value={square}
            onSquareClick={() => handleClick(squareIndex)}
          />
        ))}
      </div>
      <p>{status}</p>
      <button onClick={() => clearHistory()}>Clear</button>
      <button onClick={() => undo()}>Undo</button>
      <button onClick={() => redo()}>Redo</button>
    </div>
  );
}
export { Board };
