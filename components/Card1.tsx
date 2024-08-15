import React, { useState } from "react";
import styles from "./Dashboard.module.css";
import { AiFillCaretUp, AiFillCaretDown } from "react-icons/ai";

interface CardProps {
  title: string;
  calories: string;
  subtitle?: string;
  calorieDifference: number; // Positive or negative number indicating difference
}

const Card: React.FC<CardProps> = ({ title, calories, calorieDifference }) => {
  return (
    <div className={styles.card}>
      <div className={styles.title}>{title}</div>
      <div className={styles.calories}>{calories}</div>
      <div className={styles.calIndicator}>
        <div className={styles.calTitle}>전일대비</div>
        {calorieDifference !== undefined && calorieDifference > 0 ? (
          <AiFillCaretUp className={styles.upArrow} />
        ) : (
          <AiFillCaretDown className={styles.downArrow} />
        )}
        {calorieDifference !== undefined && calorieDifference > 0 ? (
          <div className={styles.upCalDiff}>{Math.abs(calorieDifference)}</div>
        ) : (
          <div className={styles.downCalDiff}>
            {Math.abs(calorieDifference)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
