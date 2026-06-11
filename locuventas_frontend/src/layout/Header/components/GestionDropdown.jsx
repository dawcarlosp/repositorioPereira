// src/components/layout/GestionDropdown.jsx
import React from "react";
import DropdownContainer from "@components/common/DropdownContainer";
import AdminMenu from "@layout/Header/components/AdminMenu";

export default function GestionDropdown({ isOpen, triggerRef, h }) {
  return (
    <DropdownContainer
      isOpen={isOpen}
      triggerRef={triggerRef}
      side="top"
      width="w-48"
      className="top-full mt-3 right-1 z-50"
    >
      <AdminMenu h={h} showTitle />
    </DropdownContainer>
  );
}