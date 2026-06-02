import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-sage-600 text-white shadow-soft hover:bg-sage-700',
        secondary: 'bg-white/80 text-slate-800 border border-slate-200 hover:bg-white dark:bg-white/10 dark:text-white dark:border-white/10',
        ghost: 'hover:bg-sage-100/70 dark:hover:bg-white/10',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        outline: 'border border-sage-200 text-sage-800 bg-transparent hover:bg-sage-50 dark:text-sage-100 dark:border-white/10'
      },
      size: {
        sm: 'h-9 px-3',
        default: 'h-11 px-4',
        lg: 'h-12 px-5',
        icon: 'h-11 w-11'
      }
    },
    defaultVariants: { variant: 'default', size: 'default' }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = 'Button';
