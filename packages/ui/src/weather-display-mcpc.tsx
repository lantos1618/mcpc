import React from 'react';
import { z } from 'zod';
import { createMCPC, type MCPCRenderProps, type MCPCDefinition } from '@mcpc/core';

// Schemas and Types specific to Weather MCPCs

// Schema for GetCurrentWeather parameters
const GetCurrentWeatherParamsSchema = z.object({
  location: z.string().describe('The city and state, e.g., San Francisco, CA'),
});

// Result type for the server-side execute function of GetCurrentWeather
export interface RawWeatherData {
  city: string;
  temp_c: number;
  condition: string;
  icon: string;
}

// Data type for the WeatherDisplayComponent props
export interface WeatherDisplayData {
  location: string;
  temperature: string;
  description: string;
  iconUrl?: string;
}

// Parameter type for actions triggered from WeatherDisplayComponent
export interface WeatherActionParams {
  location: string;
  days?: number; // Optional for actions like 7-day forecast
}

// --- WeatherDisplayComponent ---
const WeatherDisplayComponent: React.FC<MCPCRenderProps<WeatherDisplayData, WeatherActionParams>> = ({ data, onAction }) => {
  return (
    <div className="weather-card" style={{border: '1px solid #ccc', padding: '10px', margin: '5px', borderRadius: '4px'}}>
      <h4 style={{marginTop: 0, marginBottom: '8px'}}>{data.location}</h4>
      <p style={{margin: '2px 0'}}>Temperature: {data.temperature}</p>
      <p style={{margin: '2px 0'}}>
        Condition: {data.description} 
        {data.iconUrl && <img src={data.iconUrl} alt="weather icon" style={{width:20, height:20, verticalAlign: 'middle', marginLeft: '5px'}}/>}
      </p>
      <button 
        onClick={() => onAction('GET_7_DAY_FORECAST', { location: data.location, days: 7 })} 
        style={{marginTop: '10px', marginRight: '5px'}}
      >
        7-Day Forecast
      </button>
      <button 
        onClick={() => onAction('REFRESH_CURRENT', { location: data.location })}
        style={{marginTop: '10px'}}
      >
        Refresh Current
      </button>
    </div>
  );
};

// --- GetCurrentWeather MCPC Definition ---
export const GetCurrentWeatherMCPC: MCPCDefinition<
  typeof GetCurrentWeatherParamsSchema,
  RawWeatherData,
  WeatherDisplayData,
  WeatherActionParams
> = createMCPC({
  toolName: 'weather.getCurrentWeather',
  description: 'Gets the current weather for a specified location.',
  schema: GetCurrentWeatherParamsSchema,
  
  execute: async ({ location }) => {
    console.log(`SERVER STUB: Fetching weather for ${location}`);
    // Simulate API call delay
    await new Promise(res => setTimeout(res, 500)); 
    if (location.toLowerCase().includes("fail")) {
        throw new Error ("Simulated server error: Failed to fetch weather for this city");
    }
    // Mock data based on README example
    return {
      city: location,
      temp_c: Math.floor(Math.random() * 20) + 10, 
      condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
      icon: 'mock_icon_url.png' // Placeholder, actual icon handling would be more complex
    };
  },

  uiComponent: WeatherDisplayComponent,

  dataTransformer: (toolResult) => {
    return {
      location: toolResult.city,
      temperature: `${toolResult.temp_c}°C`,
      description: toolResult.condition,
      iconUrl: toolResult.icon, // Assuming icon is a direct URL or needs mapping
    };
  },

  uiActions: {
    'GET_7_DAY_FORECAST': {
      type: 'mcpToolRedirect', // Specify type for discriminated union
      mcpToolName: 'weather.getSevenDayForecast', // Target tool name
      mapParams: (params: WeatherActionParams) => ({ city: params.location, num_days: params.days || 7 }),
    },
    'REFRESH_CURRENT': {
        type: 'mcpToolRedirect',
        mcpToolName: 'weather.getCurrentWeather', 
        mapParams: (params: WeatherActionParams) => ({ location: params.location }),
    }
  },
  // clientExecute is not used in this example, so it can be omitted or empty.
});

// Note: The 'weather.getSevenDayForecast' MCPC is not defined here.
// It would be a separate MCPCDefinition that this one can redirect to. 