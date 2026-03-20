# 🏨 JBG Hotel Order Tracking Panel

A frontend prototype for a **hotel internal operations panel**, designed to support the *Scan → Order → Deliver* workflow.

This system helps hotel staff efficiently manage room service orders, track real-time status, and identify orders requiring attention.

---

## ⚙️ How to Run

### 🔧 Environment Setup

```bash
# Install Node (Mac - Homebrew)
brew install node

# Check installation
node -v
npm -v
```

### 📦 Project Setup

```bash
# Clone repository
git clone https://github.com/SicilyXu/hotel-panel.git

# Enter project folder
cd hotel-panel

# Install dependencies
npm install
```

### ▶️ Run the Project

```bash
npm run dev
```

### 🌐 Open in Browser

http://localhost:3000

> If port 3000 is occupied, Vite will automatically switch to another port.

---

## 📌 Assumptions

- All orders are **food-related (room service)**
- The system is used by **hotel staff only**
- Order data is **mocked locally (no backend)**
- Status updates are **manually controlled**
- No real-time updates are implemented
- Guest rating appears only after completion

---

## 🎯 Design Decisions

### 1. Table-Centric Layout
A table view was used to allow staff to quickly scan and compare multiple orders efficiently.

### 2. Attention System
Orders are categorised into:
- Urgent
- Delayed
- Reminder

This reduces cognitive load and highlights critical tasks.

### 3. Status Flow Design
A clear order lifecycle is implemented:

Placed → Accepted → Preparing → Ready → Delivering → Delivered

A stepper UI ensures clarity and prevents incorrect transitions.

### 4. Slide-in Detail Panel
Instead of page navigation:
- A drawer panel is used  
- Keeps context  
- Improves speed of interaction  

### 5. Consistent UI System
Reusable components:
- StatusBadge  
- Buttons  
- Filters  

Ensure consistent design across the app.

---

## 🧠 Priorities

### 🔴 High Priority
- Order lifecycle tracking  
- Search / filter / sorting  
- Attention highlighting  
- Clear table layout  

### 🟡 Medium Priority
- Order detail panel  
- Status update actions  
- Rating display  

### ⚪ Low Priority
- Animations  
- Mobile responsiveness  
- Backend integration  

---

## 🚀 Improvements

### 1. Real-time Updates
- WebSocket integration  
- Live status sync  

### 2. Backend Integration
- API connection  
- Persistent storage  

### 3. Role-Based System
- Admin vs staff views  

### 4. Mobile Optimization
- Tablet-friendly UI  
- Responsive layout  

### 5. Analytics Dashboard
- Order timing analysis  
- Delay insights  

### 6. Notification System
- Alerts for urgent orders  
- Sound / push notifications  

---

## 🛠 Tech Stack

- React  
- TypeScript  
- Vite  
- Tailwind CSS  
- PostCSS  
- React Context API  
- React Router  

---

## 📁 Project Structure

```bash
src/
├── components/
│   ├── base/
│   ├── feature/
├── pages/
│   ├── dashboard/
│   ├── orders/
├── context/
├── hooks/
├── types/
├── mocks/
├── App.tsx
├── main.tsx
```

---

## 🤖 AI Usage

AI tools were used to:
- Improve component structure  
- Generate mock data  
