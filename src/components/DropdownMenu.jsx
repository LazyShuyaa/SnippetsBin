import React from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import { cn } from '../lib/utils';
import Popover, { useDisclosure } from './ui/Popover';

/**
 * Compact "more actions" menu used in the snippet toolbar.
 *
 * `items` is an array of { icon, label, hint, onClick, href, danger, dividerBefore }.
 */
export default function DropdownMenu({ items = [], label = 'More actions', className }) {
  const { open, toggle, close } = useDisclosure();

  return (
    <Popover
      open={open}
      onClose={close}
      align="right"
      label={label}
      className={className}
      panelClassName="w-56 p-1.5"
      trigger={
        <button
          type="button"
          onClick={toggle}
          className={cn('icon-btn h-8 w-8', open && 'icon-btn-active')}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={label}
          title={label}
        >
          <FiMoreVertical aria-hidden="true" />
        </button>
      }
    >
      <div role="menu" aria-label={label} className="flex flex-col">
        {items.map((item, index) => {
          if (!item) return null;
          const Icon = item.icon;
          const content = (
            <>
              {Icon && <Icon className="shrink-0 text-ink-400" aria-hidden="true" />}
              <span className="flex-1 truncate">{item.label}</span>
              {item.hint && <span className="kbd shrink-0">{item.hint}</span>}
            </>
          );

          return (
            <React.Fragment key={item.label || index}>
              {item.dividerBefore && <span className="my-1 block h-px bg-white/[0.07]" aria-hidden="true" />}
              {item.href ? (
                <a
                  role="menuitem"
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noreferrer' : undefined}
                  onClick={close}
                  className={cn('menu-item', item.danger && 'text-flare-400 hover:text-flare-400')}
                >
                  {content}
                </a>
              ) : (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    close();
                    item.onClick?.();
                  }}
                  className={cn('menu-item', item.danger && 'text-flare-400 hover:text-flare-400')}
                >
                  {content}
                </button>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </Popover>
  );
}
