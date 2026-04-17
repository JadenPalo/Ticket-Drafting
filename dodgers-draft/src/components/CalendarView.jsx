import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/calendar.css";

function CalendarView({
  games = [],
  pickedGames = {},
  currentUserId,
  currentTurnUserId,
  setSelectedGameDetails,
}) {
  const getGameFromDate = (date) => {
    if (!games || games.length === 0) return null;

    // ✅ LOCAL DATE FIX (important)
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    const dateStr = `${yyyy}-${mm}-${dd}`;

    return games.find((game) => game.date === dateStr);
  };

  return (
    <Calendar
      // ✅ ALWAYS allow click (UI only)
      onClickDay={(value) => {
        const game = getGameFromDate(value);
        if (!game) return;

        setSelectedGameDetails(game);
      }}

      // ✅ YOUR ORIGINAL UI BACK
      tileContent={({ date }) => {
        const game = getGameFromDate(date);
        if (!game) return null;

        const formattedTime = new Date(game.time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div className="tile-card">
            <div className="tile-middle">
              <span className="vs-text">vs</span>
              <span className="team-name">{game.opponent}</span>
              <span className="game-time">{formattedTime}</span>
            </div>
          </div>
        );
      }}

      // ✅ COLOR LOGIC RESTORED
      tileClassName={({ date }) => {
        const game = getGameFromDate(date);
        if (!game) return "no-game";

        const pickedBy = pickedGames?.[game.id];

        if (!pickedBy) return "available";
        if (pickedBy === currentUserId) return "picked-by-you";
        return "picked";
      }}
    />
  );
}

export default CalendarView;