// src/layout/Header/components/VendedoresDropdown.jsx
import React from "react";
import DropdownContainer from "@components/common/DropdownContainer";
import useHeaderManager from "@hooks/useHeaderManager";
import AdminMenu from "@layout/Header/components/AdminMenu";

export default function VendedoresDropdown({ isOpen, triggerRef }) {
  const h = useHeaderManager();

  return (
    <DropdownContainer
      isOpen={isOpen}
      triggerRef={triggerRef}
      arrowOffset={triggerRef ? undefined : "68px"}
      side="top"
      width="w-60"
      className="right-[calc(100%+12px)] top-0 z-50"
    >
      <AdminMenu h={h} />
    </DropdownContainer>
  );
}