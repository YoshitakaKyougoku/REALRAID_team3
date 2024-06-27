import React, { useContext } from "react";
import styles from "./UserTable.module.css";
import { LobbyContext } from "@/provider/lobby";

const UserTable: React.FC = () => {
  const { users } = useContext(LobbyContext);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>順番</th>
          <th>ユーザー名</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={index}>
            <td>{`${index + 1}`}</td>
            <td>{user}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
