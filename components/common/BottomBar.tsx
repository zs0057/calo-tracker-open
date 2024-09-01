import analytics from "@/lib/analytics";
import { useRouter } from "next/navigation";
import React from "react";
import { FaChartBar, FaClipboardList } from "react-icons/fa";

const BottomBar = () => {
  const router = useRouter();

  const handleReportClick = () => {
    analytics.track("레포트 이동");
    router.push("/report"); // '/report' 페이지로 이동
  };

  return (
    <div className="fixed bottom-0 w-full max-w-xl bg-white flex justify-around items-center py-2 shadow-md mx-auto left-0 right-0 border-t border-gray-200 rounded-t-3xl">
      <div className="flex flex-col items-center">
        <FaChartBar className="text-[#E86896] text-2xl" />
        <span className="mt-2 text-xs text-gray-400">측정</span>
      </div>
      <div className="flex flex-col items-center">
        <FaClipboardList
          className="text-gray-400 text-2xl"
          onClick={handleReportClick}
        />
        <span className="mt-2 text-xs text-gray-400">리포트</span>
      </div>
    </div>
  );
};

export default BottomBar;
