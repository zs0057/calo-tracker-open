import { create } from "zustand";

interface Store {
  kakaoEmail: string;
  setkakaoEmail: (kakaoEmail: string) => void;
}

const useStore = create<Store>((set) => ({
  kakaoEmail: "",
  setkakaoEmail: (kakaoEmail: string) => set({ kakaoEmail }),
}));

export default useStore;
