# 🌍 Travel Plan Pro - AI-Powered Travel Planning

An innovative travel planning web application that uses AI to generate personalized itineraries, recommend destinations, and help manage travel budgets.

## 🎯 Features

✨ **AI Itinerary Generator** - Generate personalized day-by-day travel plans using Google Gemini AI  
🗺️ **Destination Recommender** - Discover perfect travel destinations based on your preferences  
📦 **Smart Packing List** - AI-generated packing checklists tailored to your trip  
💰 **Budget Calculator** - Track expenses and plan your travel budget (₹ Indian Rupees)  
💾 **Save Trips** - Store and manage your favorite itineraries  
🎨 **Beautiful UI** - Modern, responsive design with Tailwind CSS  
🔐 **User Authentication** - Secure login/signup system  

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript, Tailwind CSS
- **AI API:** Google Gemini 2.0 Flash
- **Storage:** LocalStorage & Firebase (optional)
- **Chart Library:** Chart.js
- **Hosting:** Netlify

## 📁 Project Structure

travel-planner-pro/
├── index.html # Homepage
├── css/
│ └── styles.css # Custom styles
├── js/
│ ├── auth.js # Authentication logic
│ ├── storage.js # Data storage
│ └── main.js # Main functionality
├── pages/
│ ├── generator.html # AI Itinerary Generator
│ ├── recommender.html # Destination Recommender
│ ├── packing.html # Packing List Generator
│ ├── budget.html # Budget Calculator
│ ├── saved.html # Saved Trips
│ └── destinations.html # Destinations
├── .env # Environment variables (not in git)
└── .gitignore # Git ignore file


## 🚀 Getting Started

### Prerequisites
- Web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Google Gemini API key

### Installation

1. **Clone the repository:**

git clone https://github.com/Raj-nikam26/travel-planner-pro.git
cd travel-planner-pro


2. **Setup environment variables:**
cp .env.example .env

Add your Gemini API key to `.env`

3. **Open in browser:**
- Simply open `index.html` in your web browser
- Or use a local server:

python -m http.server 8000

Visit http://localhost:8000


## 📖 Usage

### 1. **Create Itinerary**
- Go to "Generator" page
- Enter destination, duration, budget, travel style
- Click "Generate Itinerary"
- AI creates personalized day-by-day plan

### 2. **Find Destinations**
- Go to "Recommender" page
- Answer questions about your travel preferences
- Get destination recommendations

### 3. **Plan Packing**
- Go to "Packing List" page
- Select destination, duration, weather, activities
- Get smart packing recommendations
- Export as PDF

### 4. **Budget Planning**
- Go to "Budget Calculator" page
- Add expenses by category
- Track spending and see breakdown
- Export budget report

### 5. **Save Trips**
- Go to "My Trips" page
- View all saved itineraries
- Delete or view details

## 🔑 Environment Variables

Create a `.env` file in root:

GEMINI_API_KEY=your_api_key_here


**Never commit `.env` to GitHub!** Use `.gitignore`

## 📱 Browser Support

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)


## 👨‍💻 Author

**Raj Nikam** - Developer & Creator

- GitHub: [@raj-nikam26](https://github.com/Raj-nikam26)


## 🤝 Contributing

Contributions are welcome! Feel free to fork and submit pull requests.

## 🎓 Learning Resources

This project demonstrates:
- AI/ML integration (Google Gemini API)
- Frontend development (HTML, CSS, JavaScript)
- Responsive Web Design
- User Authentication
- Data Management
- Chart visualization
- Deployment on Netlify

## 🙏 Acknowledgments

- Google Gemini AI for powering the intelligent features
- Tailwind CSS for beautiful styling
- Chart.js for data visualization
- Netlify for hosting

## 📈 Future Features

- [ ] Hotel recommendations
- [ ] Flight bookings integration
- [ ] Weather API integration
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Real-time collaboration
- [ ] Social sharing features

---

**Created by Raj Nikam** ✨
