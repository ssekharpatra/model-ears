/**
 * Button — Reusable primary button component.
 * Currently used for "Buy Now" CTA. Designed for extensibility
 * with future variants (ghost, outlined, etc.).
 */
interface ButtonProps {
   children: React.ReactNode;
   onClick?: () => void;
   className?: string;
}

export function Button({ children, onClick, className = "" }: ButtonProps) {
   return (
      <button
         onClick={onClick}
         className={`
        bg-brand-orange hover:bg-brand-orange
        rounded-3xl text-white px-8 py-3
        text-xs font-medium tracking-wider whitespace-nowrap
        transition-all duration-300
        hover:shadow-[0_0_26px_#f67300]
        active:scale-95
        font-saira
        cursor-pointer
        ${className}
      `}
      >
         {children}
      </button>
   );
}
