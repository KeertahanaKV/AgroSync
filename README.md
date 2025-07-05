# 🌾 AgroSync – Smart Farming Companion

AgroSync is an **AI-powered smart farming platform** designed to empower farmers with intelligent tools for better decision-making, resource tracking, and livestock health monitoring. With AgroSync, technology meets agriculture in a simple, meaningful way.

---

##  Core Features

### 🌱 Crop Recommendation  
Recommends the **best crop to grow** based on **soil nutrients** and **weather conditions**.

**📥 Inputs:**  
- Nitrogen (N)  
- Phosphorus (P)  
- Potassium (K)  
- Temperature  
- Humidity  
- pH  
- Rainfall  

---

### 📦 Inventory Management  
Track and manage essential farming resources:

-  Seeds  
- Fertilizers  
- Tools  
- Fruits & Vegetables  

** Smart Alerts:**  
-  **Low Stock** – Notifies when stock drops below threshold (30%)
-  **Out of Stock** – Alerts when quantity is zero  
-  **Expired Items** – Detects and flags expired resources

---

### 🐄 Livestock Disease Detection  
Predicts livestock diseases using vital health indicators.

** Inputs:**  
-  **Animal Name**  
-  **Age**  
- Temperature**  
- **Symptoms** (Choose any 3):  
---

###  Talk to AgroBot  
A smart assistant powered by **Google Gemini AI** for real-time agricultural support.

**Ask anything like:**  
>  "Which crop grows best now?"  
>  "Is it going to rain in Mysuru?"  

Supports **voice and text chat**.

---

##  AI/ML Stack

|  Feature               |  Model/Tech           |  Description                           |
|-------------------------|----------------------|------------------------------------------
| Crop Recommendation     | RandomForestClassifier      | Trained on kaggle dataset          |
| Livestock Disease       | RandomForestClassifier       | Trained on Kaggle animal symptoms dataset |
| AgroBot Assistant       | Gemini 2.5 (Flash)   | Smart conversational AI with voice  and text chat      |

---

## 🛠️ Tech Stack

- **Frontend:** React.js + Tailwind CSS  
-  **Backend:** Flask  
-  **Machine Learning:** Scikit-learn  
-  **Database:** MySql 


---


