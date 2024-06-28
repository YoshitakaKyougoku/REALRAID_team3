import React, { useContext } from "react";
import styles from "./UserTable.module.css";
import { LobbyContext } from "@/app/lobby/[id]/page";

const UserTable: React.FC = () => {
  const { users } = useContext(LobbyContext);

  return (
    <div className={styles.table_container}>
      <div className={styles.title}>参加者一覧</div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>順番</th>
            <th>ユーザー名</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index} className={styles.user_row}>
              <td>{`${index + 1}`}</td>
              <td>{user}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
