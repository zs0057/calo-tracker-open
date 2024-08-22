"use client";
import { Mixpanel } from "@/lib/mixpanel";
import { useEffect, ReactNode } from "react";

interface MixpanelComponentProps {
  name: string;
  data?: any; // `data`의 타입을 명확히 알고 있다면, 해당 타입으로 변경하세요.
  children?: ReactNode;
}

const MixpanelComponent = ({
  name,
  data,
  children,
}: MixpanelComponentProps) => {
  useEffect(() => {
    Mixpanel.track(name, data);
  }, []);

  return <>{children}</>;
};

export default MixpanelComponent;
