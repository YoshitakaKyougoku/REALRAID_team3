import { LobbyContext } from "@/app/lobby/[id]/page";
import { useContext } from "react";

export default function ShowCurrentPlayer({ lobbyId }: { lobbyId: string }) {
  const { userNumber, users } = useContext(LobbyContext);
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
