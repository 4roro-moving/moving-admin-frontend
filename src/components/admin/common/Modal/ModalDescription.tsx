"use client";

import { useEffect, type ReactNode } from "react";

import Text from "@/components/admin/common/Text";
import { type TextVariantProp } from "@/components/admin/common/Text";
import { cn } from "@/lib/utils/cn";

import { useModalContext } from "./ModalMain";

interface ModalDescriptionProps {
  children: ReactNode;
  className?: string;
  variant?: TextVariantProp;
}

const ModalDescription = ({
  children,
  className,
  variant = "md-regular",
}: ModalDescriptionProps) => {
  const { descriptionId, setHasDescription } = useModalContext();

  useEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);

  return (
    <Text
      as="p"
      id={descriptionId}
      variant={variant}
      className={cn("text-text-secondary", className)}
    >
      {children}
    </Text>
  );
};

export default ModalDescription;
