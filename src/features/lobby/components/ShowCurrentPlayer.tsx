interface ShowCurrentPlayerProps {
  lobbyId: string;
  users: string[];
  userNumber: number | null;
}

export default function ShowCurrentPlayer({
  lobbyId,
  users,
  userNumber,
}: ShowCurrentPlayerProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold">ロビーID: {lobbyId}</h1>
      <div className="text-lg">参加者: {users.join(", ")}</div>
      <div className="text-lg">現在のプレイヤー: {userNumber}</div>
      {users.length < 4 && (
        <div className="text-gray-500">他のプレイヤーを待っています...</div>
      )}
    </div>
  );
}
