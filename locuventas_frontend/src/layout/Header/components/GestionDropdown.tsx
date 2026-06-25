import type { UseHeaderManagerReturn } from "@hooks/useHeaderManager";
import DropdownContainer from "@components/common/DropdownContainer";
import AdminMenu from "@layout/Header/components/AdminMenu";

interface Props {
  isOpen:      boolean;
  triggerRef:  React.RefObject<HTMLElement | null>;
  h:           UseHeaderManagerReturn;
}

export default function GestionDropdown({ isOpen, triggerRef, h }: Props) {
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
