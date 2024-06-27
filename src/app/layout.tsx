"use client";
import { LobbyContext } from "./context";
import { useState } from "react";

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [users, setUsers] = useState<string[]>([]);
  const [userNumber, setUserNumber] = useState<number | null>(null!);
  const [isMyTurn, setIsMyTurn] = useState<boolean>(false);
  const [input, setInput] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState<string | null>("");

  return (
    <html lang="ja">
      <body>
        <LobbyContext.Provider
          value={{
            userNumber,
            setUserNumber,
            users,
            setUsers,
            isMyTurn,
            setIsMyTurn,
            currentPlayer,
            setCurrentPlayer,
            input,
            setInput,
          }}
        >
          {children}
        </LobbyContext.Provider>
      </body>
    </html>
  );
}
