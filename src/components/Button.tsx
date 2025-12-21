import React, { ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  confirmMessage?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className,
  disabled,
  confirmMessage,
  onClick,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (confirmMessage && !window.confirm(confirmMessage)) {
      return;
    }
    onClick?.(e);
  };

  const variantClasses = {
    primary: 'bg-teal-600 hover:bg-teal-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 text-white',
  };

  const sizeClasses = {
    sm: 'text-xs py-1 px-2 rounded',
    md: 'text-sm py-2 px-4 rounded-md',
    lg: 'text-base py-3 px-6 rounded-lg',
  };

  const buttonClasses = classNames(
    'font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 inline-flex items-center justify-center',
    variantClasses[variant],
    sizeClasses[size],
    {
      'opacity-60 cursor-not-allowed': disabled,
      'w-full': fullWidth,
      'focus:ring-teal-400': variant === 'primary',
      'focus:ring-gray-400': variant === 'secondary',
      'focus:ring-green-400': variant === 'success',
      'focus:ring-red-400': variant === 'danger',
      'focus:ring-amber-400': variant === 'warning',
      'focus:ring-blue-400': variant === 'info',
    },
    className
  );

  return (
    <button 
      className={buttonClasses} 
      disabled={disabled} 
      onClick={handleClick}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </button>
  );
};

export default Button;