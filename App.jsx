import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [grid, setGrid] = useState({});

  useEffect(() => {
    socket.on("initGrid", (cells) => {
      const map = {};
      cells.forEach(c => map[c.cellId] = c);
      setGrid(map);
    });

    socket.on("updateCell", (cell) => {
      setGrid(prev => ({ ...prev, [cell.cellId]: cell }));
    });
  }, []);

  const handleClick = (id) => {
    socket.emit("claimCell", {
      cellId: id,
      user: "User_" + Math.floor(Math.random() * 1000),
      color: "#22c55e"
    });
  };

  return (
    <div className="grid grid-cols-20 gap-1 p-4">
      {Array.from({ length: 400 }).map((_, i) => {
        const id = `${Math.floor(i / 20)}-${i % 20}`;
        const cell = grid[id];

        return (
          <div
            key={id}
            onClick={() => handleClick(id)}
            className="w-6 h-6 cursor-pointer border"
            style={{
              backgroundColor: cell?.color || "#e5e7eb"
            }}
          />
        );
      })}
    </div>
  );
}

export default App;