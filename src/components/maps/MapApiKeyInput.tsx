import React, { useState } from 'react';
import { Key, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MapApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
}

export const MapApiKeyInput: React.FC<MapApiKeyInputProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleSubmit = () => {
    if (apiKey.trim()) {
      // Store in localStorage for this session
      localStorage.setItem('google_maps_api_key', apiKey.trim());
      onApiKeySet(apiKey.trim());
      setIsValid(true);
    }
  };

  return (
    <div className="bg-amber-900/20 backdrop-blur-sm rounded-xl border border-amber-500/20 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Key className="w-5 h-5 text-amber-400" />
        <h3 className="text-amber-400 font-bold">Google Maps Configuration</h3>
      </div>

      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          To use the enhanced interactive map, you need a Google Maps API key. 
          This enables real-time routing and location services for combat operations.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Google Maps API Key
          </label>
          <div className="flex space-x-2">
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Google Maps API key"
              className="flex-1"
            />
            <Button onClick={handleSubmit} disabled={!apiKey.trim()}>
              Set Key
            </Button>
          </div>
        </div>

        <div className="text-xs text-gray-400 space-y-2">
          <div className="flex items-start space-x-2">
            <span className="font-medium">1.</span>
            <span>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 inline-flex items-center">
              Google Cloud Console <ExternalLink className="w-3 h-3 ml-1" />
            </a></span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-medium">2.</span>
            <span>Create a new API key or use an existing one</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-medium">3.</span>
            <span>Enable "Maps JavaScript API" and "Directions API"</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-medium">4.</span>
            <span>Copy and paste your API key above</span>
          </div>
        </div>

        {isValid === false && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Invalid API key or missing permissions. Please check your key and ensure the required APIs are enabled.
            </AlertDescription>
          </Alert>
        )}

        {isValid === true && (
          <Alert className="border-green-500/20 bg-green-900/20">
            <AlertCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-300">
              API key configured successfully! The enhanced map is now available.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};