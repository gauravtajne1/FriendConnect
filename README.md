# FriendConnect — Social Network Graph Analysis
### Design and Analysis of Algorithms (DAA) Mini Project

FriendConnect is an educational, interactive web application designed to demonstrate fundamental **Design and Analysis of Algorithms (DAA)** concepts using social network graph analysis.

Vertices represent users and undirected edges represent mutual friendships. The project strictly implements and exposes real graph algorithms rather than hardcoding results or simulating answers.

---

## 👥 Project Team

- **Ziya Ullah Khan**
- **Pawni Jain**
- **Gaurav Purushotam Tajne**

*Course: Design and Analysis of Algorithms (DAA) • B.Tech Computer Science & Engineering*

---

## 🚀 Key Features & DAA Concepts

| Feature / Algorithm | Data Structure | Time Complexity | Space Complexity |
| :--- | :--- | :--- | :--- |
| **User Search / Lookup** | Hash Table (`dict[str, dict]`) | $O(1)$ average | $O(V)$ |
| **User Addition** | Hash Map + Empty Set | $O(1)$ average | $O(1)$ |
| **Friendship Management** | Adjacency List (`dict[str, set[str]]`) | $O(1)$ average | $O(V + 2E)$ |
| **Mutual Friends** | Set Intersection ($\text{Friends}(A) \cap \text{Friends}(B)$) | $O(\min(\deg(A), \deg(B)))$ | $O(\min(\deg(A), \deg(B)))$ |
| **Friend Suggestions** | 2-Hop Traversal + Frequency Map + Sorting | $O(W + C \log C)$ | $O(C)$ |
| **Shortest Path** | Breadth-First Search (FIFO Queue + Parent Dict) | $O(V + E)$ | $O(V)$ |
| **Community Detection** | Depth-First Search (LIFO Stack + Visited Set) | $O(V + E)$ | $O(V)$ |
| **Graph Visualization** | Interactive Force-Directed Canvas (Coulomb + Hooke) | 60 FPS Render | $O(V + E)$ |

---

## 🏗️ Project Structure

```
friendconnect/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AlgorithmCard.jsx      # Reusable academic explanation panel
│   │   │   ├── Header.jsx             # Top bar with status metrics
│   │   │   ├── Sidebar.jsx            # Modern navigation sidebar
│   │   │   └── Toast.jsx              # Status notifications
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx          # Statistics & quick-access cards
│   │   │   ├── Users.jsx              # User CRUD & O(1) hash search
│   │   │   ├── Friendships.jsx        # Edge management & adjacency list viewer
│   │   │   ├── MutualFriends.jsx      # Set intersection demonstration
│   │   │   ├── Suggestions.jsx        # Common-neighbour recommendation
│   │   │   ├── ShortestPath.jsx       # BFS with FIFO queue execution trace
│   │   │   ├── Communities.jsx        # DFS connected component decomposition
│   │   │   ├── GraphVisualization.jsx # Interactive force-directed canvas
│   │   │   ├── AlgorithmAnalysis.jsx  # Full asymptotic complexity study
│   │   │   └── AboutProject.jsx       # Course metadata & team roster
│   │   ├── services/
│   │   │   └── api.js                 # Centralized REST API client
│   │   ├── App.jsx                    # Root view controller
│   │   ├── main.jsx                   # React DOM entry point
│   │   └── index.css                  # Tailwind styles
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/
│   ├── data/
│   │   └── social_network.json        # Persistent JSON dataset
│   ├── graph.py                       # SocialNetworkGraph class (Adjacency List)
│   ├── algorithms.py                  # DAA implementations (BFS, DFS, Sets)
│   ├── main.py                        # FastAPI RESTful endpoints
│   └── requirements.txt
│
├── requirements.txt
└── README.md
```

---

## 🛠️ Installation & Setup

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

---

### Step 1: Run the Backend

1. Navigate to the backend directory:
   ```bash
   cd friendconnect/backend
   ```
2. (Optional) Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server using Uvicorn:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   The backend API will run at: **`http://localhost:8000`**  
   Interactive Swagger docs are available at: **`http://localhost:8000/docs`**

---

### Step 2: Run the Frontend

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd friendconnect/frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at: **`http://localhost:3000`**

---

## 📊 Preloaded Academic Demonstration Dataset

The application starts preloaded with this standard canonical network:

### 1. Vertices (9 Users)
- `u01` — Aarav
- `u02` — Diya
- `u03` — Kabir
- `u04` — Meera
- `u05` — Ishaan
- `u06` — Anaya
- `u07` — Rohan
- `u08` — Sara
- `u09` — Vivaan

### 2. Undirected Edges (9 Friendships)
- `u01 — u02`, `u01 — u03`
- `u02 — u03`, `u02 — u04`
- `u03 — u05`, `u04 — u05`
- `u06 — u07`, `u06 — u08`
- `u07 — u08`

### 3. Discovered Connected Components (Communities via DFS)
1. **Community 1**: `{u01, u02, u03, u04, u05}` (5 users, 6 internal edges)
2. **Community 2**: `{u06, u07, u08}` (3 users, 3 internal edges)
3. **Community 3**: `{u09}` (1 user, isolated vertex)

---

## 🧪 Demonstration Test Cases (Evaluation Walkthrough)

### 1. Mutual Friends
- **Input**: User A = `u01` (Aarav), User B = `u04` (Meera)
- **Calculation**: $\text{Friends}(\text{u01}) \cap \text{Friends}(\text{u04}) = \{\text{u02}, \text{u03}\} \cap \{\text{u02}, \text{u05}\} = \{\text{u02}\}$
- **Expected Output**: **`u02` (Diya)**

### 2. Friend Suggestions
- **Input**: User = `u01` (Aarav)
- **Calculation**: Direct friends are `u02` and `u03`.
  - Friends of `u02`: `u03` (direct), `u04` (candidate via Diya)
  - Friends of `u03`: `u02` (direct), `u05` (candidate via Kabir)
- **Expected Output**:
  - `u04` (Meera) — 1 mutual friend (`Diya`)
  - `u05` (Ishaan) — 1 mutual friend (`Kabir`)

### 3. BFS Shortest Path (Connected)
- **Input**: Source = `u01` (Aarav), Destination = `u05` (Ishaan)
- **Expected Shortest Path**: **`u01 → u03 → u05`**
- **Distance**: **2 edges**

### 4. BFS Shortest Path (Disconnected)
- **Input**: Source = `u01` (Aarav), Destination = `u07` (Rohan)
- **Expected Output**: **"No connection exists between the selected users."**

### 5. DFS Connected Components
- **Expected Output**: **3 connected components**
  - Component 1: `Aarav, Diya, Kabir, Meera, Ishaan`
  - Component 2: `Anaya, Rohan, Sara`
  - Component 3: `Vivaan`

### 6. Reset Dataset
- At any time, click **"Reset Dataset"** in the sidebar to atomically reload this canonical dataset from disk.

---

## 📝 License
Educational Academic Project for Design and Analysis of Algorithms (DAA).
