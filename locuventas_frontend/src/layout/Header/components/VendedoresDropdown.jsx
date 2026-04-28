// src/layout/Header/components/VendedoresDropdown.jsx
import React from "react";
import DropdownContainer from "@components/common/DropdownContainer";
import useBreakpoint from "@hooks/useBreakpoint";
import useHeaderManager from "@hooks/useHeaderManager";
import AdminActionsPersonal from "./AdminActionsPersonal";

export default function VendedoresDropdown({
  isOpen,
  onClickPendientes,
  isPendientesOpen,
  onConfirmacion,
}) {
  const breakpoint = useBreakpoint();
  const h = useHeaderManager();
  const isSmall = ["xs", "sm", "md"].includes(breakpoint);

  return (
    <DropdownContainer
      isOpen={isOpen}
      side="right"
      arrowOffset="68px"
      width="w-60"
      className="absolute right-[calc(100%+12px)] top-0"
    >
      <AdminActionsPersonal 
        onClickPendientes={onClickPendientes} 
        isPendientesOpen={isPendientesOpen} 
        onConfirmacion={onConfirmacion} 
        isSmall={isSmall}
        h={h}
      />
    </DropdownContainer>
  );
}