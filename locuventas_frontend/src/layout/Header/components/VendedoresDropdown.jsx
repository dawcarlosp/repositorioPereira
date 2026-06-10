// src/layout/Header/components/VendedoresDropdown.jsx
import React from "react";
import DropdownContainer from "@components/common/DropdownContainer";
import useHeaderManager from "@hooks/useHeaderManager";
import AdminActionsPersonal from "@layout/Header/components/AdminActionsPersonal";
import useResponsiveLayout from "@hooks/useResponsiveLayout";
export default function VendedoresDropdown({
  isOpen, triggerRef 
}) {
  const h = useHeaderManager();
 const { isSmall, isMedium } = useResponsiveLayout();

  return (
    <DropdownContainer
      isOpen={isOpen}
      triggerRef={triggerRef}   
      arrowOffset={triggerRef ? undefined : "68px"} 
      side="top"
      width="w-60"
      className="absolute right-[calc(100%+12px)] top-0"
    >
      <AdminActionsPersonal h={h} />
    </DropdownContainer>
  );
}