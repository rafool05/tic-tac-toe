import { create } from "zustand";
import { useShallow } from "zustand/react/shallow"
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
    set((state) => ({
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
  
  const curIdx = useGameStore((state) => state.curIdx);
  const history = useGameStore((state) => state.history);
  const setIdx = useGameStore((state) => state.setIdx);
  const setHistory = useGameStore((state) => state.setHistory);
  const clearHistory = useGameStore((state) => state.clearHistory);
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
      
    </div>
  );
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
}
function Buttons(){
  function undo() {
    if (!curIdx) return;
    setIdx(curIdx - 1);
  }
  function redo() {
    if (curIdx === history.length - 1) return;
    setIdx(curIdx + 1);
  }
  const clearHistory = useGameStore(useShallow((state) => state.clearHistory))
  const curIdx = useGameStore(useShallow((state) => state.curIdx))
  const setIdx = useGameStore(useShallow((state) => state.setIdx))
  const history = useGameStore(useShallow((state) => state.history))
  return (<>
    <button onClick={() => clearHistory()}>Clear</button>
    <button onClick={() => undo()}>Undo</button>
    <button onClick={() => redo()}>Redo</button>
  </>)
}
function Game(){
  return (<div>
    <Board></Board>
    <Buttons></Buttons>
  </div>)
}

export { Game };
