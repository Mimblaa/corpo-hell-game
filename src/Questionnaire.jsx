"use client";
import React, { useState, useEffect } from "react";
import "./App.css";

const Questionnaire = ({ onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Load questions and categories from localStorage
    const storedQuestions = localStorage.getItem("questionnaireData");
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const stats = calculateStats(answers);
    localStorage.setItem("playerStats", JSON.stringify(stats));
    onComplete(); // Notify parent to proceed
  };

  const calculateStats = (answers) => {
    let stats = {
      reputation: 50,
      bossTrust: 50,
      teamTrust: 50,
      efficiency: 50,
      politicalSkill: 30,
      responsibilityAvoidance: 30,
      buzzwordPower: 30,
      stress: 20,
      patience: 80,
      productivityTheatre: 40,
    };

    questions.forEach((category) => {
      category.questions.forEach((question) => {
        const selectedAnswer = question.options.find(
          (option) => option.value === answers[question.id]
        );
        if (selectedAnswer) {
          Object.keys(selectedAnswer.effects).forEach((stat) => {
            stats[stat] += selectedAnswer.effects[stat];
          });
        }
      });
    });

    return stats;
  };

  return (
    <div className="start-page">
      <div className="chat-container">
        <h1>Kwestionariusz Startowy</h1>
        <form onSubmit={handleSubmit}>
          {questions.map((category) => (
            <div key={category.id}>
              <h2>{category.name}</h2>
              {category.questions.map((question) => (
                <div key={question.id} className="question-container">
                  <label>{question.text}</label>
                  {question.options.map((option) => (
                    <div key={option.value}>
                      <input
                        type="radio"
                        name={question.id}
                        value={option.value}
                        onChange={handleChange}
                        required
                      />{" "}
                      {option.text}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
          <button type="submit">Zakończ</button>
        </form>
      </div>
    </div>
  );
};

export default Questionnaire;
