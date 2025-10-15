import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VoterDashboard from "./pages/VoterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { candidates, adminAccount } from "./data";

export default function App() {
  const [page, setPage] = useState("login");
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [votes, setVotes] = useState(() => {
    const saved = localStorage.getItem("votes");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("votes", JSON.stringify(votes));
  }, [votes]);

  const register = (user) => {
    setUsers([...users, user]);
    setPage("login");
  };

  const login = (email, password) => {
    if (email === adminAccount.email && password === adminAccount.password) {
      setCurrentUser({ name: "Admin", role: "admin" });
      setPage("admin");
      return;
    }

    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      setCurrentUser(found);
      setPage("voter");
    } else {
      alert("Invalid credentials!");
    }
  };

  const vote = (candidateId) => {
    const alreadyVoted = votes.find((v) => v.voter === currentUser.email);
    if (alreadyVoted) {
      alert("You have already voted!");
      return;
    }
    const newVotes = [...votes, { voter: currentUser.email, candidateId }];
    setVotes(newVotes);
    alert("Vote cast successfully!");
  };

  const logout = () => {
    setCurrentUser(null);
    setPage("login");
  };

  return (
    <>
      {page === "login" && <Login onLogin={login} onSwitch={() => setPage("register")} />}
      {page === "register" && <Register onRegister={register} onSwitch={() => setPage("login")} />}
      {page === "voter" && (
        <VoterDashboard
          candidates={candidates}
          user={currentUser}
          votes={votes}
          onVote={vote}
          onLogout={logout}
        />
      )}
      {page === "admin" && (
        <AdminDashboard
          votes={votes}
          candidates={candidates}
          users={users}
          onLogout={logout}
        />
      )}
    </>
  );
}
