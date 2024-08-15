import React, { useEffect, useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import styles from "./Dashboard.module.css";
import Card from "./Card";
import WeeklyCaloriesStackedChart from "./WeeklyCaloriesStackedChart"; // 새로운 컴포넌트 임포트
import {
  formatDate,
  getTodayDateInKorea,
  generateLabelDates,
} from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";
import { getMealCaloriesByDateAndEmail } from "@/lib/getCalorie";
import { getWeeklyCalorie } from "@/lib/getWeeklyCalorie";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Content = {
  breakfast: number;
  lunch: number;
  dinner: number;
  snack: number;
} | null;

const Dashboard: React.FC = () => {
  const router = useRouter(); // Next.js 라우터 사용
  const [content, setContent] = useState<Content>(null);
  const [yesterdayContent, setYesterdayContent] = useState<Content>(null);
  const [date, setDate] = useState(getTodayDateInKorea());
  const [view, setView] = useState("daily"); // "daily" 또는 "weekly" 상태 추가
  const [breakfast, setBreakfast] = useState<number[]>([]);
  const [lunch, setLunch] = useState<number[]>([]);
  const [dinner, setDinner] = useState<number[]>([]);
  const [snack, setSnack] = useState<number[]>([]);
  const kakaoEmailRef = useRef<string>("");

  useEffect(() => {
    const signInWithKakao = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!session) {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "kakao",
          options: {
            scopes: "profile_image,account_email",
            redirectTo: process.env.NEXT_PUBLIC_BASE_URL,
          },
        });

        if (error) {
          console.error("Error signing in:", error);
        } else {
          console.log("Signed in successfully:", data);
          router.push("/"); // Redirect to the root route after successful sign-in
        }
      } else {
        if (typeof session.user.email === "string") {
          kakaoEmailRef.current = session.user.email;
        }
        router.push("/"); // Redirect to the root route if session already exists
      }

      if (kakaoEmailRef.current) {
        try {
          const currentData = await getMealCaloriesByDateAndEmail(
            kakaoEmailRef.current,
            formatDate(date)
          );
          setContent(currentData);
        } catch (error) {
          console.error("Error fetching meal calories:", error);
        }
      }
    };

    signInWithKakao();
  }, [router, date]); // Adding router and date to the dependency array

  useEffect(() => {
    const fetchDataAsync = async () => {
      if (view === "daily") {
        if (kakaoEmailRef.current) {
          try {
            const newDate = new Date(date);
            newDate.setDate(newDate.getDate() - 1);

            const [currentData, yesterDayData] = await Promise.all([
              getMealCaloriesByDateAndEmail(
                kakaoEmailRef.current,
                formatDate(date)
              ),
              getMealCaloriesByDateAndEmail(
                kakaoEmailRef.current,
                formatDate(newDate)
              ),
            ]);

            setContent(currentData);
            setYesterdayContent(yesterDayData);
          } catch (error) {
            console.error("Error fetching meal calories:", error);
          }
        }
      } else if (view === "weekly") {
        const weeklyData = await getWeeklyCalorie(
          kakaoEmailRef.current,
          formatDate(date)
        );
        setBreakfast(weeklyData.breakfast);
        setLunch(weeklyData.lunch);
        setDinner(weeklyData.dinner);
        setSnack(weeklyData.snack);
      }
    };
    fetchDataAsync();
  }, [date, view]);

  const handlePrevDay = () => {
    setDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  const handleImageClick = () => {
    router.push("/"); // 루트 경로로 이동
  };

  const totalCalories =
    (content ? content.breakfast : 0) +
    (content ? content.lunch : 0) +
    (content ? content.dinner : 0) +
    (content ? content.snack : 0);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerDate}>
            <Image
              src="/calculator.png"
              alt="Calculator"
              className={styles.calculatorIcon}
              onClick={handleImageClick}
              width={30} // 이미지의 너비를 명시적으로 설정
              height={30} // 이미지의 높이를 명시적으로 설정
            />
            <button className={styles.navButton} onClick={handlePrevDay}>
              <FaChevronLeft />
            </button>
            <div className={styles.date}>{formatDate(date)}</div>
            <button className={styles.navButton} onClick={handleNextDay}>
              <FaChevronRight />
            </button>
          </div>
        </div>
        <div className={styles.headerToggle}>
          <button
            className={`${styles.toggleButton} ${
              view === "daily" && styles.active
            }`}
            onClick={() => setView("daily")}
          >
            Daily
          </button>
          <button
            className={`${styles.toggleButton} ${
              view === "weekly" && styles.active
            }`}
            onClick={() => setView("weekly")}
          >
            Weekly
          </button>
        </div>
      </header>
      <main>
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={view}
            timeout={300}
            classNames={{
              enter: styles.sectionEnter,
              enterActive: styles.sectionEnterActive,
              exit: styles.sectionExit,
              exitActive: styles.sectionExitActive,
            }}
          >
            {view === "daily" ? (
              <div>
                <section className={styles.content}>
                  <div className={styles.sectionTitle}>총 칼로리</div>
                  <div className={styles.sectionCalories}>
                    {totalCalories} kcal
                  </div>
                  <div className={styles.gridContainer}>
                    <Card
                      title="아침"
                      calories={`${
                        content?.breakfast ? content.breakfast : 0
                      } kcal`}
                      calorieDifference={
                        content && yesterdayContent
                          ? content.breakfast - yesterdayContent.breakfast
                          : 0
                      }
                    />
                    <Card
                      title="점심"
                      calories={`${content?.lunch ? content.lunch : 0} kcal`}
                      calorieDifference={
                        content && yesterdayContent
                          ? content.lunch - yesterdayContent.lunch
                          : 0
                      }
                    />
                    <Card
                      title="저녁"
                      calories={`${content?.dinner ? content.dinner : 0} kcal`}
                      calorieDifference={
                        content && yesterdayContent
                          ? content.dinner - yesterdayContent.dinner
                          : 0
                      }
                    />
                    <Card
                      title="간식"
                      calories={`${content?.snack ? content.snack : 0} kcal`}
                      calorieDifference={
                        content && yesterdayContent
                          ? content.snack - yesterdayContent.snack
                          : 0
                      }
                    />
                  </div>
                </section>
              </div>
            ) : (
              <section className={styles.content}>
                <WeeklyCaloriesStackedChart
                  breakfast={breakfast}
                  lunch={lunch}
                  dinner={dinner}
                  snack={snack}
                  labelDate={generateLabelDates(formatDate(date), 7)}
                />
              </section>
            )}
          </CSSTransition>
        </SwitchTransition>
      </main>
      <footer className={styles.footer}>
        <div>다이어트 레포트</div>
      </footer>
    </div>
  );
};

export default Dashboard;
