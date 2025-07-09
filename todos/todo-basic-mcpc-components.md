# TODO: Develop Basic MCPC Components

**Phase:** 1 (Core Framework)
**Package:** `@mcpc/ui` (or in examples)

## Task

Create a small set of basic, reusable MCPC components using the `createMCPC` factory. These will serve as examples and building blocks for more complex applications.

## Components to Create

1.  **`SimpleTextDisplayMCPC`**
    *   **Purpose**: To display a simple string message from the AI.
    *   **`execute`**: A simple function that returns its input string.
    *   **`uiComponent`**: A React component that renders the text in a `<p>` or `<div>`.
    *   **`toolName`**: `ui.displayText`

2.  **`KeyValuePairsDisplayMCPC`**
    *   **Purpose**: To display a JSON object as a formatted key-value table or list.
    *   **`execute`**: Returns a JSON object.
    *   **`uiComponent`**: A React component that iterates over object keys and displays them in a structured way.
    *   **`toolName`**: `ui.displayKeyValuePairs`

3.  **`WeatherDisplayMCPC`**
    *   **Purpose**: A more complete example, as detailed in the main `README.md`.
    *   **`execute`**: Mocks a call to a weather API.
    *   **`uiComponent`**: A card-based component displaying weather data with interactive buttons.
    *   **`uiActions`**: Defines actions for "Refresh" and "7-Day Forecast".
    *   **`toolName`**: `weather.getCurrentWeather`

## Acceptance Criteria

-   Each component is defined in its own file (e.g., `packages/ui/src/simple-text-display-mcpc.ts`).
-   Each component is created using the `createMCPC` factory.
-   Each component is exported and can be registered in a client application.
-   Each component has a corresponding Storybook story to demonstrate its appearance and functionality.
