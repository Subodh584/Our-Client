import React, { useState, useEffect, useRef, useCallback } from "react";
import { getFileLines, addLineToFile, deleteLineFromFile } from "../api";
import { useNavigate } from "react-router-dom";

export default function Chat({ fName }) {
  const [fileName, setFileName] = useState(fName);
  const [user, setUser] = useState(() => localStorage.getItem("UserName"));
  const [lines, setLines] = useState([]);
  const [newLine, setNewLine] = useState("");
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  const fetchLines = useCallback(async () => {
    if (!fileName) return;
    const data = await getFileLines(fileName);
    setLines(data);
  }, [fileName]); // Only recreate if fileName changes

  useEffect(() => {
    setFileName(fName);
  }, [fName]);

  useEffect(() => {
    if (fileName) {
      fetchLines();
    }
    setUser(localStorage.getItem("UserName"));
  }, [fileName, fetchLines]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const handleAddLine = async () => {
    if (newLine.trim() === "") return;
    await addLineToFile(
      fileName,
      user === "Subodh" ? "#" + newLine : "@" + newLine
    );
    setNewLine("");
    fetchLines();
  };

  const handleDeleteLine = async (index) => {
    await deleteLineFromFile(fileName, index + 1);
    fetchLines();
  };

  const handleBack = () => {
    navigate('/');
  };

  return fName === "Complaints" ? (
    <div className="chatContainer">
    <button className="logout-button" onClick={handleBack}>
        Back
      </button>
      <h2 style={{ textAlign: "center", marginBottom: "10px", color: "#333" }}>
        Complaints
      </h2>

      <ul className="complaintList">
        {lines.map((line, index) => (
          <li
            className={
              (user === "Subodh" && line.startsWith("#")) ||
              (user === "Namee" && line.startsWith("@"))
                ? "rightChat"
                : "leftChat"
            }
            key={index}
          >
            {line.charAt(1).toUpperCase() + line.slice(2)}{" "}
            {(user === "Subodh" && line.startsWith("#")) ||
            (user === "Namee" && line.startsWith("@")) ? (
              <button id="cross" onClick={() => handleDeleteLine(index)}>
                X
              </button>
            ) : null}
          </li>
        ))}
        <div ref={chatEndRef}></div>
      </ul>

      <div className="chatInputContainer">
        <input
          id="textField"
          type="text"
          value={newLine}
          onChange={(e) => setNewLine(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="beautifulButton" onClick={handleAddLine}>➤</button>
      </div>
    </div>
  ) : (
    <div className="reasonsContainer">
    <button className="logout-button" onClick={handleBack}>
        Back
      </button>
      <h2 className="reasonsTitle">Reasons I Love You</h2>
      <div className="reasonsGrid">
        {lines.map((line, index) => (
          <div className="reasonCard" key={index}>
            <span className="reasonNumber">#{index + 1}</span>
            <p className="reasonText">{line.charAt(1).toUpperCase() + line.slice(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
