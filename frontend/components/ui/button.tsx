import * as React from "react" // Importing React for JSX functionality
import { Slot } from "@radix-ui/react-slot" // Slot is used for rendering child components in Radix UI
import { cva, type VariantProps } from "class-variance-authority" // cva is used to define and handle CSS class variants
import { cn } from "@/lib/utils" // Utility function to merge class names

// Define button variants using cva (class variance authority)
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", // Base button styles
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90", // Default variant styles
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90", // Destructive (danger) variant styles
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground", // Outline variant styles
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80", // Secondary variant styles
        ghost: "hover:bg-accent hover:text-accent-foreground", // Ghost variant (transparent background)
        link: "text-primary underline-offset-4 hover:underline", // Link variant (styled as a link)
      },
      size: {
        default: "h-10 px-4 py-2", // Default button size
        sm: "h-9 rounded-md px-3", // Small button size
        lg: "h-11 rounded-md px-8", // Large button size
        icon: "h-10 w-10", // Icon button size (square)
      },
    },
    defaultVariants: {
      variant: "default", // Default variant is 'default'
      size: "default", // Default size is 'default'
    },
  }
)

// ButtonProps extends ButtonHTMLAttributes to accept all standard button properties
// It also includes VariantProps to apply button variant styles
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean // Option to render as another component (useful for wrapper components)
}

// Button component that forwards the ref and applies the appropriate styles
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button" // Render either the Slot component or a regular button depending on 'asChild'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))} // Apply variant and size styles using 'cva'
        ref={ref}
        {...props} // Pass the rest of the props (e.g., onClick, disabled) to the component
      />
    )
  }
)
Button.displayName = "Button" // Set display name for better debugging

// Export Button component and the variants for use elsewhere
export { Button, buttonVariants }
