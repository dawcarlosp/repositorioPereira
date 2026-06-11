// src/layout/Header/components/AdminMenu.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import RecursiveMenu from "@components/common/RecursiveMenu";
import useResponsiveLayout from "@hooks/useResponsiveLayout";
import { adminMenuConfig } from "../config/adminMenuConfig";

export default function AdminMenu({ h, showTitle = false }) {
  const { isSmall, isMedium } = useResponsiveLayout();
  const navigate = useNavigate();

  if (!h) return null;

  const items = adminMenuConfig(navigate, h);

  return (
    <div className="flex flex-col gap-1.5">
      {showTitle && (
        <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] text-left ml-2 mb-1">
          Administración
        </p>
      )}
      <RecursiveMenu
        items={items}
        depth={0}
        onClose={h.closeAll}
        isSmall={isSmall}
        isMedium={isMedium}
        h={h}
      />
    </div>
  );
}