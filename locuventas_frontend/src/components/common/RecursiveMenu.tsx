import { useState, useRef, Fragment } from "react";
import BotonClaro from "@buttons/BotonClaro";
import DropdownContainer from "@components/common/DropdownContainer";
import {
  CircleArrowLeft, CircleArrowRight,
  CircleArrowDown, CircleArrowUp,
} from "lucide-react";
import PendientesList from "@components/vendedor/PendientesList";
import type { UseHeaderManagerReturn } from "@hooks/useHeaderManager";
import type { MenuItem } from "@domain/ui.types";

interface RecursiveMenuProps {
  items:     MenuItem[];
  depth?:    number;
  onClose:   () => void;
  isSmall?:  boolean;
  isMedium?: boolean;
  h:         UseHeaderManagerReturn;
}

const PANEL_MAP: Record<string, React.ComponentType<Record<string, unknown>>> = { PendientesList };

export default function RecursiveMenu({
  items,
  depth = 0,
  onClose,
  isSmall,
  isMedium,
  h,
}: RecursiveMenuProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggerRefs = useRef<Record<number, React.RefObject<HTMLButtonElement | null>>>({});

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  const useAccordion = isSmall || isMedium;

  return (
    <div className="relative flex flex-col gap-1 p-1">
      {items.map((item, i) => {
        const hasChildren  = (item.children?.length ?? 0) > 0;
        const hasPanel     = !!item.panel;
        const hasAction    = !!item.action;
        const isOpen       = openIndex === i;

        if (!triggerRefs.current[i]) {
          triggerRefs.current[i] = { current: null } as React.RefObject<HTMLButtonElement | null>;
        }

        if (!hasChildren && !hasPanel) {
          return (
            <BotonClaro
              key={item.label}
              className="!h-9 !text-[10px] !justify-start whitespace-nowrap"
              onClick={() => { onClose(); item.action?.(); }}
            >
              {item.label}
            </BotonClaro>
          );
        }

        if (useAccordion) {
          if (hasPanel && hasAction) {
            return (
              <BotonClaro
                key={item.label}
                className="!h-9 !text-[10px] !justify-start whitespace-nowrap"
                onClick={() => { onClose(); item.action(); }}
              >
                {item.label}
              </BotonClaro>
            );
          }

          return (
            <div key={item.label} className="flex flex-col gap-1">
              <BotonClaro
                onClick={(e) => { e.stopPropagation(); toggle(i); }}
                className={`!h-9 flex justify-evenly items-center w-full whitespace-nowrap ${
                  isOpen ? "text-orange-400 bg-orange-500/10" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  {isOpen ? <CircleArrowUp size={16} /> : <CircleArrowDown size={16} />}
                  {item.label}
                </div>
              </BotonClaro>
              {isOpen && (
                <div className="pl-4 flex flex-col gap-1 border-l border-zinc-800 ml-3 my-1 animate-in slide-in-from-top-1">
                  <RecursiveMenu
                    items={item.children ?? []}
                    depth={depth + 1}
                    onClose={onClose}
                    isSmall={isSmall}
                    isMedium={isMedium}
                    h={h}
                  />
                </div>
              )}
            </div>
          );
        }

        const PanelComponent = hasPanel ? PANEL_MAP[item.panel] : null;

        return (
          <Fragment key={item.label}>
            <BotonClaro
              ref={(el) => { (triggerRefs.current[i] as { current: HTMLButtonElement | null }).current = el; }}
              onClick={(e) => { e.stopPropagation(); toggle(i); }}
              className={`!h-9 !text-[10px] w-full flex justify-evenly whitespace-nowrap ${
                isOpen ? "bg-orange-500/10 text-orange-400" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                {isOpen
                  ? <CircleArrowRight className="opacity-50" size={14} />
                  : <CircleArrowLeft  className="text-purple-500" size={14} />
                }
                {item.label}
              </div>
            </BotonClaro>

            <DropdownContainer
              isOpen={isOpen}
              triggerRef={triggerRefs.current[i]}
              side="right"
              width={item.panelWidth ?? "w-56"}
              className="right-[calc(100%+20px)] top-0 z-[60]"
            >
              {PanelComponent
                ? <PanelComponent {...(item.panelProps ?? {})} />
                : (
                  <RecursiveMenu
                    items={item.children ?? []}
                    depth={depth + 1}
                    onClose={onClose}
                    isSmall={isSmall}
                    isMedium={isMedium}
                    h={h}
                  />
                )
              }
            </DropdownContainer>
          </Fragment>
        );
      })}
    </div>
  );
}
