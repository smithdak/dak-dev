import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

const buttonStyles = {
  base: 'inline-flex items-center justify-center font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed',

  variants: {
    primary:
      'bg-text text-background border border-text hover:bg-accent hover:border-accent focus:ring-accent',
    secondary: 'bg-transparent text-text border border-text/35 hover:border-text focus:ring-accent',
    ghost:
      'bg-transparent text-text border border-transparent hover:border-text/25 hover:bg-surface/60 focus:ring-accent',
    accent:
      'bg-accent text-background border border-accent hover:bg-text hover:border-text focus:ring-accent',
  },

  sizes: {
    sm: 'px-4 py-2 text-sm gap-2',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-3',
  },
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'left',
  className = '',
  disabled = false,
  type = 'button',
  ...props
}: ButtonProps) {
  const classNames = [
    buttonStyles.base,
    buttonStyles.variants[variant],
    buttonStyles.sizes[size],
    className,
  ].join(' ');

  return (
    <motion.button
      type={type}
      className={classNames}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.985 }}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
    </motion.button>
  );
}
