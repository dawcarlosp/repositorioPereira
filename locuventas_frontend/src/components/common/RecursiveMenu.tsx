import { useState, useRef, Fragment } from "react";
import Button from "@buttons/Button";
import DropdownContainer from "@components/common/DropdownContainer";
import {
  CircleArrowLeft, CircleArrowRight,
  CircleArrowDown, CircleArrowUp,
} from "lucide-react";
import PendientesList from "@features/auth/components/PendientesList";
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

// SOLUCIÓN 1: Usar 'any' temporalmente en las props del mapa dinámico 
// para que acepte componentes con distintas firmas de props obligatorias.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PANEL_MAP: Record<string, React.ComponentType<any>> = { PendientesList };

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
            <Button
              variant="secondary"
              key={item.label}
              className="!h-9 !text-[10px] !justify-start whitespace-nowrap"
              onClick={() => { onClose(); item.action?.(); }}
            >
              {item.label}
            </Button>
          );
        }

        if (useAccordion) {
          if (hasPanel && hasAction) {
            return (
              <Button
                variant="secondary"
                key={item.label}
                className="!h-9 !text-[10px] !justify-start whitespace-nowrap"
                // SOLUCIÓN 2: Uso seguro de la función mediante encadenamiento opcional (?.)
                onClick={() => { onClose(); item.action?.(); }}
              >
                {item.label}
              </Button>
            );
          }

          return (
            <div key={item.label} className="flex flex-col gap-1">
              <Button
                variant="secondary"
                onClick={(e) => { e.stopPropagation(); toggle(i); }}
                className={`!h-9 flex justify-evenly items-center w-full whitespace-nowrap ${
                  isOpen ? "text-orange-400 bg-orange-500/10" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  {isOpen ? <CircleArrowUp size={16} /> : <CircleArrowDown size={16} />}
                  {item.label}
                </div>
              </Button>
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

        // SOLUCIÓN 3: Validar que item.panel exista antes de usarlo como índice del objeto
        const PanelComponent = item.panel ? PANEL_MAP[item.panel] : null;

        return (
          <Fragment key={item.label}>
            <Button
              variant="secondary"
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
            </Button>

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
