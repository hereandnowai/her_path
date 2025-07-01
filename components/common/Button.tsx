import React from 'react';

// Define own props for the Button, excluding 'as' and 'children' which are handled by PolymorphicComponentProps
interface ButtonOwnProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'link';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

// Helper types for creating a polymorphic component
type AsProp<C extends React.ElementType> = {
  as?: C;
};

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProps<
  C extends React.ElementType,
  Props = {}
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

// Default element type
const defaultButtonElement = 'button';

// Final props type for the Button component
export type ButtonProps<C extends React.ElementType = typeof defaultButtonElement> =
  PolymorphicComponentProps<C, ButtonOwnProps>;

const Button = <C extends React.ElementType = typeof defaultButtonElement>({
  as,
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  ...restProps
}: ButtonProps<C>) => {
  const Component = as || defaultButtonElement;

  const baseStyle = 'font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 ease-in-out inline-flex items-center justify-center';
  
  let variantStyle = '';
  switch (variant) {
    case 'primary':
      variantStyle = 'bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500';
      break;
    case 'secondary':
      variantStyle = 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400';
      break;
    case 'danger':
      variantStyle = 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500';
      break;
    case 'link':
      variantStyle = 'bg-transparent hover:text-teal-700 text-teal-600 focus:ring-teal-500 underline';
      break;
  }

  let sizeStyle = '';
  switch (size) {
    case 'sm':
      sizeStyle = 'px-3 py-1.5 text-sm';
      break;
    case 'md':
      sizeStyle = 'px-4 py-2 text-base';
      break;
    case 'lg':
      sizeStyle = 'px-6 py-3 text-lg';
      break;
  }

  const widthStyle = fullWidth ? 'w-full' : '';

  // Default 'type' to 'button' if the component is a button and type is not set
  let finalProps = restProps;
  if (Component === 'button' && !(restProps as React.ButtonHTMLAttributes<HTMLButtonElement>).type) {
    finalProps = { ...restProps, type: 'button' } as typeof restProps;
  }

  return (
    <Component
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${widthStyle} ${className}`}
      {...finalProps}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </Component>
  );
};

export default Button;