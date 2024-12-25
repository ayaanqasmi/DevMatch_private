"use client"

import * as React from "react" // Import React for JSX functionality
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react" // Import the Embla carousel hook
import { ArrowLeft, ArrowRight } from "lucide-react" // Import arrow icons for navigation buttons

import { cn } from "@/lib/utils" // Utility function for conditional class names
import { Button } from "@/components/ui/button" // Button component for navigation controls

// Define types for Embla carousel API and options
type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

// Define props for the Carousel component
type CarouselProps = {
  opts?: CarouselOptions // Carousel options (e.g., loop, speed)
  plugins?: CarouselPlugin // Carousel plugins (e.g., autoplay, drag)
  orientation?: "horizontal" | "vertical" // Orientation of the carousel
  setApi?: (api: CarouselApi) => void // Function to set the API for external control
}

// Define context props for the carousel context
type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0] // Reference to the carousel container
  api: ReturnType<typeof useEmblaCarousel>[1] // API for interacting with the carousel
  scrollPrev: () => void // Function to scroll to the previous slide
  scrollNext: () => void // Function to scroll to the next slide
  canScrollPrev: boolean // Indicates if it's possible to scroll to the previous slide
  canScrollNext: boolean // Indicates if it's possible to scroll to the next slide
} & CarouselProps

// Create a context for carousel state management
const CarouselContext = React.createContext<CarouselContextProps | null>(null)

// Custom hook to access the carousel context
function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

// Carousel component
const Carousel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CarouselProps>(
  (
    { orientation = "horizontal", opts, setApi, plugins, className, children, ...props },
    ref
  ) => {
    // Initialize Embla carousel with options and plugins
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y", // Set axis based on orientation
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false) // Track if scrollPrev is possible
    const [canScrollNext, setCanScrollNext] = React.useState(false) // Track if scrollNext is possible

    // Callback to update scroll availability
    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    // Functions to scroll to the previous/next slide
    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    // Handle keyboard navigation (left and right arrow keys)
    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    // Update the API context for external control
    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    // Setup event listeners for the carousel (reInit, select)
    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on("reInit", onSelect) // Update scroll availability when reinitialized
      api.on("select", onSelect) // Update scroll availability when slide changes

      return () => {
        api?.off("select", onSelect) // Cleanup event listeners on unmount
      }
    }, [api, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown} // Capture keyboard events for navigation
          className={cn("relative", className)} // Apply styles and class names
          role="region" // Define the region role for accessibility
          aria-roledescription="carousel" // Provide role description for screen readers
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

// CarouselContent component
const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel()

    return (
      <div ref={carouselRef} className="overflow-hidden">
        <div
          ref={ref}
          className={cn(
            "flex",
            orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", // Adjust layout based on orientation
            className
          )}
          {...props}
        />
      </div>
    )
  }
)
CarouselContent.displayName = "CarouselContent"

// CarouselItem component (individual slides)
const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { orientation } = useCarousel()

    return (
      <div
        ref={ref}
        role="group" // Define the group role for accessibility
        aria-roledescription="slide" // Provide role description for screen readers
        className={cn(
          "min-w-0 shrink-0 grow-0 basis-full", // Ensure item takes full width or height
          orientation === "horizontal" ? "pl-4" : "pt-4", // Adjust spacing based on orientation
          className
        )}
        {...props}
      />
    )
  }
)
CarouselItem.displayName = "CarouselItem"

// CarouselPrevious component (previous button)
const CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel()

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full", // Position button absolutely
          orientation === "horizontal"
            ? "-left-12 top-1/2 -translate-y-1/2" // Position for horizontal orientation
            : "-top-12 left-1/2 -translate-x-1/2 rotate-90", // Position for vertical orientation
          className
        )}
        disabled={!canScrollPrev} // Disable button if no previous slide
        onClick={scrollPrev}
        {...props}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Previous slide</span>
      </Button>
    )
  }
)
CarouselPrevious.displayName = "CarouselPrevious"

// CarouselNext component (next button)
const CarouselNext = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel()

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full", // Position button absolutely
          orientation === "horizontal"
            ? "-right-12 top-1/2 -translate-y-1/2" // Position for horizontal orientation
            : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90", // Position for vertical orientation
          className
        )}
        disabled={!canScrollNext} // Disable button if no next slide
        onClick={scrollNext}
        {...props}
      >
        <ArrowRight className="h-4 w-4" />
        <span className="sr-only">Next slide</span>
      </Button>
    )
  }
)
CarouselNext.displayName = "CarouselNext"

// Export components and types
export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
