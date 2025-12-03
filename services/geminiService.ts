
// Service to communicate with the Python FastAPI Backend

// Defines the structure expected by ChatInterface
export interface ChatSession {
  sendMessageStream: (params: { message: string }) => AsyncGenerator<{ text: string; images?: string[] }, void, unknown>;
}

/**
 * Creates a chat session that communicates with the local Python backend.
 */
export const createChatSession = (): ChatSession => {
  // Get API URL from environment variable or default to localhost
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  // Check backend health first
  const checkBackendHealth = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  };

  return {
    sendMessageStream: async function* ({ message }) {
      try {
        // Check if backend is available
        const isHealthy = await checkBackendHealth();
        if (!isHealthy) {
          yield { text: " [Backend Error: The Python backend server is not responding. Please ensure:\n1. The backend is running (python main.py)\n2. It's listening on port 8000\n3. Check the terminal for error messages] " };
          return;
        }

        const response = await fetch(`${API_URL}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => response.statusText);
          throw new Error(`Backend error (${response.status}): ${errorText}`);
        }

        if (!response.body) {
          throw new Error('No response body received from backend');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunkText = decoder.decode(value, { stream: true });
          buffer += chunkText;
          
          // Check for image markers: [IMAGES:image1.jpg,image2.png]
          const imageMarkerRegex = /\[IMAGES:([^\]]+)\]/;
          let match = buffer.match(imageMarkerRegex);
          
          while (match) {
            // Extract images from marker
            const imageList = match[1].split(',').map(img => img.trim()).filter(img => img);
            
            // Get text before the marker
            const beforeMarker = buffer.substring(0, match.index);
            
            // Remove the marker and everything before it from buffer
            buffer = buffer.substring(match.index! + match[0].length);
            
            // Yield text before marker if any
            if (beforeMarker.length > 0) {
              yield { text: beforeMarker };
            }
            
            // Yield images
            if (imageList.length > 0) {
              yield { text: '', images: imageList };
            }
            
            // Check for more markers
            match = buffer.match(imageMarkerRegex);
          }
        }
        
        // Yield any remaining buffer
        if (buffer.length > 0) {
          yield { text: buffer };
        }
      } catch (error) {
        console.error("Error connecting to Python backend:", error);
        
        // Provide more helpful error messages
        let errorMessage = " [Connection Error: ";
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          errorMessage += `Cannot connect to the backend server. Please ensure:\n1. The backend is running: python main.py\n2. It's listening on ${API_URL}\n3. Check that the backend URL is correct] `;
        } else if (error instanceof Error) {
          errorMessage += `${error.message}] `;
        } else {
          errorMessage += "An unexpected error occurred. Check the console for details.] ";
        }
        
        yield { text: errorMessage };
      }
    }
  };
};
