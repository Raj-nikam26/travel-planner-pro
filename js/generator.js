// Add CSS animations at the start
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    #chat-messages {
        scroll-behavior: smooth;
    }
`;
document.head.appendChild(styleSheet);

// Generator page - Persist itinerary
document.addEventListener('DOMContentLoaded', function() {
    requireAuth();
    loadPersistedItinerary();
    
    const selectedDestination = localStorage.getItem('selectedDestination');
    if (selectedDestination) {
        document.getElementById('destination').value = selectedDestination;
        localStorage.removeItem('selectedDestination');
    }
});

window.addEventListener('beforeunload', function() {
    if (window.currentItinerary) {
        sessionStorage.setItem('persistedItinerary', JSON.stringify(window.currentItinerary));
    }
});

const MODEL_NAME = "gemini-2.0-flash-exp";
const API_KEY = "AIzaSyDHjAULKuG1OLN8J5LNMkTgwQ5Fz_t8c3Y";

function getBasePath() {
    return window.location.pathname.includes('/pages/') ? '../' : './';
}

function formatItineraryBeautifully(markdown) {
    let html = `<div class="itinerary-container">`;
    
    // Split into sections
    const lines = markdown.split('\n');
    let currentSection = null;
    let sectionContent = [];
    
    lines.forEach((line, index) => {
        // Main headings (like "## Day 1: Morning")
        if (line.match(/^##\s+/)) {
            if (sectionContent.length > 0) {
                html += createSection(currentSection, sectionContent);
                sectionContent = [];
            }
            currentSection = line.replace(/^##\s+/, '').trim();
        }
        // Secondary headings (like "### Activities")
        else if (line.match(/^###\s+/)) {
            sectionContent.push(`<h4 class="text-lg font-bold text-blue-600 mt-4 mb-2">${line.replace(/^###\s+/, '').trim()}</h4>`);
        }
        // Bold text
        else if (line.match(/\*\*/)) {
            sectionContent.push(`<p class="text-gray-700 mb-2"><strong>${line.replace(/\*\*/g, '')}</strong></p>`);
        }
        // List items
        else if (line.match(/^\*/)) {
            const text = line.replace(/^\*\s*/, '').trim();
            sectionContent.push(`<div class="flex items-start ml-4 mb-2">
                <span class="text-blue-500 mr-3">▸</span>
                <span class="text-gray-700">${text}</span>
            </div>`);
        }
        // Regular text
        else if (line.trim()) {
            sectionContent.push(`<p class="text-gray-700 mb-2">${line.trim()}</p>`);
        }
    });
    
    // Add last section
    if (sectionContent.length > 0) {
        html += createSection(currentSection, sectionContent);
    }
    
    html += `</div>`;
    return html;
}

function createSection(title, content) {
    if (!title) return '';
    
    // Determine section type
    const isDay = title.match(/day\s+(\d+)/i);
    const icon = isDay ? '📅' : '📌';
    
    return `
        <div class="section-card bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6 border-l-4 border-blue-600 shadow-md hover:shadow-lg transition">
            <h3 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span class="text-2xl mr-2">${icon}</span>
                ${title}
            </h3>
            <div class="section-content space-y-3">
                ${content.join('')}
            </div>
        </div>
    `;
}

function loadPersistedItinerary() {
    try {
        const persisted = sessionStorage.getItem('persistedItinerary');
        if (persisted) {
            window.currentItinerary = JSON.parse(persisted);
            console.log('✅ Loaded from session');
            document.getElementById('itinerary-content').innerHTML = window.currentItinerary.content;
            document.getElementById('empty-state').classList.add('hidden');
            document.getElementById('result-section').classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

window.generateItinerary = async function() {
    const destination = document.getElementById('destination').value.trim();
    const duration = document.getElementById('duration').value;
    const budget = document.getElementById('budget').value;
    const travelStyle = document.getElementById('travelStyle').value;
    const travelerType = document.getElementById('travelerType').value;
    const specialRequirements = document.getElementById('specialRequirements').value.trim();
    
    if (!destination || !duration) {
        alert('❌ Please fill in destination and duration');
        return;
    }
    
    document.getElementById('generate-btn').disabled = true;
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('empty-state').classList.add('hidden');
    document.getElementById('result-section').classList.add('hidden');
    
    const prompt = `Create a detailed ${duration}-day travel itinerary for ${destination}.
    
Trip Details:
- Destination: ${destination}
- Duration: ${duration} days
- Budget: ${budget}
- Travel Style: ${travelStyle}
- Traveler Type: ${travelerType}
${specialRequirements ? `- Special Requirements: ${specialRequirements}` : ''}

Format the response EXACTLY like this for each day:

## Day 1: [Day Title/Theme]

### Morning
* Activity 1 with location and time
* Restaurant for breakfast with price estimate

### Afternoon
* Activity with details
* Restaurant for lunch

### Evening
* Activity/experience
* Restaurant for dinner with price

### Budget Breakdown
* Accommodation: $XXX
* Food: $XXX
* Activities: $XXX
* Transport: $XXX

(Repeat for each day)

Then add sections for:

## Accommodation Recommendations
* Hotel 1 with price and location
* Hotel 2 with price and location

## Transportation Guide
* How to get around the city
* Estimated costs

## Budget Summary
* Daily average
* Total estimated cost

## Travel Tips & Local Info
* Best times to visit attractions
* Local customs
* Safety tips
* Must-try foods
* Hidden gems`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
            })
        });
        
        if (!response.ok) throw new Error('API Error: ' + response.status);
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        
        if (data.candidates?.[0]?.content) {
            const generatedText = data.candidates[0].content.parts[0].text;
            const htmlContent = formatItineraryBeautifully(generatedText);
            
            document.getElementById('itinerary-content').innerHTML = htmlContent;
            document.getElementById('empty-state').classList.add('hidden');
            document.getElementById('result-section').classList.remove('hidden');
            
            window.currentItinerary = {
                destination, duration, budget, travelStyle, travelerType,
                specialRequirements, content: htmlContent, timestamp: Date.now()
            };
            
            sessionStorage.setItem('persistedItinerary', JSON.stringify(window.currentItinerary));
            console.log('✅ Generated & persisted');
            alert('✅ Itinerary generated!');
            showChatAfterGeneration();
        } else {
            throw new Error('No content');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Failed: ' + error.message);
    } finally {
        document.getElementById('generate-btn').disabled = false;
        document.getElementById('loading').classList.add('hidden');
    }
};

window.saveItinerary = async function() {
    if (!window.currentItinerary) {
        alert('❌ No itinerary. Generate one first!');
        return;
    }
    
    const trip = {
        id: 'trip_' + Date.now(),
        destination: window.currentItinerary.destination,
        duration: window.currentItinerary.duration,
        budget: window.currentItinerary.budget,
        travelStyle: window.currentItinerary.travelStyle,
        travelerType: window.currentItinerary.travelerType,
        specialRequirements: window.currentItinerary.specialRequirements,
        content: window.currentItinerary.content,
        timestamp: window.currentItinerary.timestamp
    };
    
    try {
        const response = await fetch(`${getBasePath()}api/trips.php?action=save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trip)
        });
        
        const data = await response.json();
        if (data.success) {
            alert('✅ Trip saved!');
        } else {
            alert('❌ ' + data.message);
        }
    } catch (error) {
        alert('❌ Save failed');
    }
};

window.exportItinerary = function() {
    if (!window.currentItinerary) {
        alert('❌ No itinerary');
        return;
    }
    
    const trip = window.currentItinerary;
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Arial', sans-serif; line-height: 1.8; color: #333; background: #f9fafb; }
.header { background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: white; padding: 50px 20px; text-align: center; }
.header h1 { font-size: 48px; margin-bottom: 10px; }
.details { background: #f3f4f6; padding: 20px; margin: 20px; border-radius: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.detail-item { padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #2563eb; }
.content { padding: 40px 20px; max-width: 1000px; margin: 0 auto; }
.section-card { background: linear-gradient(to right, #eff6ff, #f3e8ff); border-left: 4px solid #2563eb; padding: 20px; margin-bottom: 20px; border-radius: 8px; }
.section-card h3 { color: #1f2937; margin-bottom: 15px; font-size: 20px; }
h4 { color: #2563eb; font-size: 16px; margin-top: 12px; margin-bottom: 8px; }
.item { margin-left: 20px; margin-bottom: 8px; }
.footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; margin-top: 40px; }
</style>
</head>
<body>
<div class="header">
<h1>🌍 ${trip.destination}</h1>
<p style="font-size: 20px;">${trip.duration}-Day Travel Itinerary</p>
</div>
<div class="details">
<div class="detail-item"><strong>📅 Duration:</strong> ${trip.duration} days</div>
<div class="detail-item"><strong>💰 Budget:</strong> ${trip.budget}</div>
<div class="detail-item"><strong>🎯 Style:</strong> ${trip.travelStyle}</div>
<div class="detail-item"><strong>👥 Type:</strong> ${trip.travelerType}</div>
</div>
<div class="content">${trip.content}</div>
<div class="footer">Generated by TravelPlan Pro • ${new Date(trip.timestamp).toLocaleDateString()}</div>
</body>
</html>`;

    const opt = {
        margin: 10,
        filename: `${trip.destination}_itinerary.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    
    html2pdf().set(opt).from(html).save();
    alert('✅ PDF exported!');
};

window.shareItinerary = function() {
    if (!window.currentItinerary) {
        alert('❌ No itinerary');
        return;
    }
    
    const trip = window.currentItinerary;
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
* { margin: 0; padding: 0; }
body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
.header { background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: white; padding: 40px 20px; text-align: center; }
.header h1 { font-size: 48px; margin-bottom: 10px; }
.content { padding: 40px 20px; max-width: 900px; margin: 0 auto; }
.footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; margin-top: 40px; }
</style></head><body>
<div class="header"><h1>🌍 ${trip.destination}</h1><p>${trip.duration}-Day Itinerary</p></div>
<div class="content">${trip.content}</div>
<div class="footer">TravelPlan Pro</div>
</body></html>`;
    
    const opt = {
        margin: 10,
        filename: `${trip.destination}_itinerary.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    
    html2pdf().set(opt).from(html).output('blob').then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${trip.destination}_itinerary.pdf`;
        a.click();
        alert('✅ PDF downloaded - Share this file!');
    });
};

// ============ CHAT SYSTEM WITH FORMATTING ============

function toggleChat() {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.classList.toggle('hidden');
}

function showChatButton() {
    const chatButton = document.getElementById('chat-container');
    if (chatButton) {
        chatButton.classList.remove('hidden');
    }
}

async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    if (!window.currentItinerary) {
        alert('❌ Generate an itinerary first!');
        return;
    }
    
    // Add user message to chat
    addChatMessage(message, 'user');
    input.value = '';
    input.focus();
    
    try {
        const modificationPrompt = `
You are a helpful travel assistant. The user has a ${window.currentItinerary.duration}-day itinerary for ${window.currentItinerary.destination} (Budget: ${window.currentItinerary.budget}).

User request: "${message}"

Provide a SHORT, FORMATTED response with:
1. A direct answer to their request
2. 2-3 specific actionable tips (numbered)
3. An emoji or friendly sign-off

Format EXACTLY like this:
Here's how we can improve your trip:

1. First suggestion
2. Second suggestion  
3. Third suggestion

Keep it concise and friendly!`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: modificationPrompt }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
            })
        });
        
        const data = await response.json();
        
        if (data.candidates?.[0]?.content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            addChatMessage(aiResponse, 'ai');
        } else {
            addChatMessage('Sorry, I could not process your request. Please try again.', 'ai');
        }
    } catch (error) {
        console.error('Chat error:', error);
        addChatMessage('❌ Error communicating with AI', 'ai');
    }
}

function addChatMessage(text, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    
    // Format the AI response with better structure
    let formattedText = text;
    
    if (sender === 'ai') {
        // Add line breaks for better readability
        formattedText = text
            .split('\n')
            .filter(line => line.trim())
            .map(line => {
                // Bold numbered items
                if (line.match(/^\d+\./)) {
                    return `<strong style="color: #2563eb;">${line}</strong>`;
                }
                // Bullet points
                if (line.match(/^[-•*]/)) {
                    return `• ${line.replace(/^[-•*]\s*/, '')}`;
                }
                return line;
            })
            .join('<br>');
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.style.marginBottom = '12px';
    messageDiv.style.textAlign = sender === 'user' ? 'right' : 'left';
    messageDiv.style.animation = 'fadeInUp 0.3s ease';
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.style.display = 'inline-block';
    bubbleDiv.style.maxWidth = '75%';
    bubbleDiv.style.padding = '12px 15px';
    bubbleDiv.style.borderRadius = '12px';
    bubbleDiv.style.wordWrap = 'break-word';
    bubbleDiv.style.lineHeight = '1.6';
    bubbleDiv.style.fontSize = '14px';
    
    if (sender === 'user') {
        bubbleDiv.style.background = 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)';
        bubbleDiv.style.color = 'white';
        bubbleDiv.style.borderRadius = '18px 18px 4px 18px';
        bubbleDiv.style.boxShadow = '0 2px 5px rgba(37, 99, 235, 0.3)';
    } else {
        bubbleDiv.style.background = '#f3f4f6';
        bubbleDiv.style.color = '#1f2937';
        bubbleDiv.style.border = '1px solid #e5e7eb';
        bubbleDiv.style.borderRadius = '18px 18px 18px 4px';
        bubbleDiv.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.08)';
    }
    
    bubbleDiv.innerHTML = formattedText;
    messageDiv.appendChild(bubbleDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Auto-scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showChatAfterGeneration() {
    setTimeout(() => {
        showChatButton();
        addChatMessage('Hi! 👋 I can help you modify your itinerary. What would you like to change?', 'ai');
    }, 500);
}
