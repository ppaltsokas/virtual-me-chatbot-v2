
// Chat service for FastAPI backend communication
export interface ChatSession {
  sendMessageStream: (params: { message: string }) => AsyncGenerator<{ text: string; images?: string[] }, void, unknown>;
}

// Creates a chat session for backend communication
export const createChatSession = (): ChatSession => {
  // Get API URL from env or default to localhost
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
        // Check backend health
        const isHealthy = await checkBackendHealth();
        if (!isHealthy) {
          yield { text: " [Backend Error: Server not responding. Check if backend is running on port 8000] " };
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
          
          // Parse image markers: [IMAGES:image1.jpg,image2.png]
          const imageMarkerRegex = /\[IMAGES:([^\]]+)\]/;
          let match = buffer.match(imageMarkerRegex);
          
          while (match) {
            // Extract image list
            const imageList = match[1].split(',').map(img => img.trim()).filter(img => img);
            
            // Get text before marker
            const beforeMarker = buffer.substring(0, match.index);
            
            // Remove processed marker from buffer
            buffer = buffer.substring(match.index! + match[0].length);
            
            // Yield text before marker
            if (beforeMarker.length > 0) {
              yield { text: beforeMarker };
            }
            
            // Yield images
            if (imageList.length > 0) {
              yield { text: '', images: imageList };
            }
            
            // Check for additional markers
            match = buffer.match(imageMarkerRegex);
          }
        }
        
        // Yield remaining buffer
        if (buffer.length > 0) {
          yield { text: buffer };
        }
      } catch (error) {
        console.error("Error connecting to Python backend:", error);
        
        // Format error message
        let errorMessage = " [Connection Error: ";
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          errorMessage += `Cannot connect to backend at ${API_URL}. Check if server is running] `;
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
