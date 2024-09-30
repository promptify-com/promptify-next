import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import MessageContainer from "@/components/GPT/MessageContainer";
import AntArtifactComponent from "@/components/GPT/AntArtifact";
import AntThinkingComponent from "@/components/GPT/AntThinking";

interface Props {
  content: string;
}
// Function to render the streamed content with tag detection
const renderContent = ({ content }: Props) => {
  // Split by <antThinking> and <antArtifact> tags
  const parts = content.split(/(<\/?antThinking>|<\/?antArtifact)/g);
  const renderedComponents = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]?.trim();

    // Detect and render <antThinking>
    if (part.startsWith("<antThinking>")) {
      const content = parts[++i]?.trim();
      renderedComponents.push(
        <AntThinkingComponent
          key={i}
          content={content}
        />,
      );
    }
    // Detect and render <antArtifact>
    else if (part.startsWith("<antArtifact")) {
      const content = parts[++i]?.trim();
      renderedComponents.push(
        <AntArtifactComponent
          key={i}
          content={content}
        />,
      );
    }
    // Ignore empty strings and other parts
    else if (part && !part.startsWith("<")) {
      renderedComponents.push(<span key={i}>{part}</span>);
    }
  }

  return renderedComponents;
};

// Main Component
export default function MessageRender() {
  // Simulate Streaming
  const [streamedSnippet, setStreamedSnippet] = useState("");
  useEffect(() => {
    streamSnippet(testReactSnippet, 1, setStreamedSnippet);
  }, []);

  return (
    <Stack
      width={"100%"}
      alignItems={"start"}
      sx={{ gap: "24px" }}
    >
      <MessageContainer>{renderContent({ content: streamedSnippet })}</MessageContainer>
    </Stack>
  );
}

// Streaming Simulation
const streamSnippet = (snippet: string, delay: number, callback: (chunk: string) => void) => {
  let index = 0;
  const interval = setInterval(() => {
    if (index < snippet.length) {
      callback(snippet.slice(0, index + 1));
      index++;
    } else {
      clearInterval(interval);
    }
  }, delay);
};
export const testReactSnippet = `
Certainly! I'll create an interactive React component that displays a dashboard for the cryptocurrency market based on the provided data. This dashboard will include a summary of key metrics and a chart comparing the market caps of the top cryptocurrencies.

<antThinking>Creating a React component for a cryptocurrency dashboard is an excellent candidate for an artifact. It's substantial, self-contained, and can be reused or modified. This is a new request, so I'll create a new artifact with the identifier "crypto-dashboard-component".</antThinking>

<antArtifact identifier="crypto-dashboard-component" type="application/vnd.ant.react" title="React Component: Cryptocurrency Market Dashboard">
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardContent } from '@mui/material';

const cryptoData = [
  {
    "name": "Bitcoin",
    "symbol": "BTC",
    "price": 62980.03428907382,
    "market_cap": 1244242563559.8457,
    "percent_change_24h": 5.12025198
  },
  {
    "name": "Ethereum",
    "symbol": "ETH",
    "price": 2433.3086634105,
    "market_cap": 292836691134.91003,
    "percent_change_24h": 5.41850884
  },
  {
    "name": "Tether USDt",
    "symbol": "USDT",
    "price": 1.0002085336326636,
    "market_cap": 118916390947.2067,
    "percent_change_24h": 0.01319331
  },
  {
    "name": "BNB",
    "symbol": "BNB",
    "price": 565.1358491903,
    "market_cap": 82472414599.00595,
    "percent_change_24h": 4.17780571
  },
  {
    "name": "Solana",
    "symbol": "SOL",
    "price": 140.34799019961093,
    "market_cap": 65751171720.74294,
    "percent_change_24h": 7.93999166
  },
  {
    "name": "USDC",
    "symbol": "USDC",
    "price": 1.0000620379812906,
    "market_cap": 35461073340.61382,
    "percent_change_24h": 0.00431029
  }
];

const formatLargeNumber = (num) => {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  return num.toFixed(2);
};

const CryptoDashboard = () => {
  const [selectedCrypto, setSelectedCrypto] = useState(cryptoData[0]);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Cryptocurrency Market Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader title="Market Overview" />
          <CardContent>
            <p>Total Market Cap:</p>
            <p>Number of Cryptocurrencies: {cryptoData.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Selected Cryptocurrency" />
          <CardContent>
            <select 
              className="w-full p-2 mb-2 border rounded"
              onChange={(e) => setSelectedCrypto(cryptoData.find(c => c.symbol === e.target.value))}
              value={selectedCrypto.symbol}
            >
              {cryptoData.map(crypto => (
                <option key={crypto.symbol} value={crypto.symbol}>{crypto.name} (${crypto.symbol})</option>
              ))}
            </select>
         
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader title="Market Cap Comparison" />
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cryptoData}>
              <XAxis dataKey="symbol" />
              <YAxis tickFormatter={formatLargeNumber} />
              <Tooltip formatter={(value) => ['$' + formatLargeNumber(value), 'Market Cap']} />
              <Bar dataKey="market_cap" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default CryptoDashboard;
</antArtifact>

I've created an interactive React component that displays a dashboard for the cryptocurrency market based on the provided data. Here's a breakdown of the component:

1. Market Overview: This section shows the total market cap of all listed cryptocurrencies and the number of cryptocurrencies in the dataset.

2. Selected Cryptocurrency: This interactive section allows users to select a specific cryptocurrency from a dropdown menu. It displays the current price, market cap, and 24-hour price change for the selected cryptocurrency.

3. Market Cap Comparison: This section features a bar chart comparing the market caps of all the cryptocurrencies in the dataset.

The component uses Material-UI for styling and Recharts for the bar chart visualization. It also includes some custom formatting functions to display large numbers in a more readable format (e.g., billions and trillions).

To use this component, you would need to have React, Material-UI, and Recharts installed in your project. You can then import and use the CryptoDashboard component in your React application.

Would you like me to explain any part of the code in more detail or make any modifications to the dashboard?`;
