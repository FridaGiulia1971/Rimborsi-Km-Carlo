import React, { ReactNode } from 'react';
import classNames from 'classnames';

interface CardProps {
  children: ReactNode;
  title?: string;
  footer?: ReactNode;
  className?: string;
  contentClassName?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  footer,
  className,
  contentClassName,
}) => {
  return (
    <div
      className={classNames(
        'bg-white rounded-lg shadow-md overflow-hidden',
        className
      )}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className={classNames('p-6', contentClassName)}>{children}</div>
      {footer && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;