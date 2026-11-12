"""
Graph representation and management module for FriendConnect.

Academic DAA Concept:
- Vertices (Users) are stored in a Hash Table (dict) for O(1) average-time lookups.
- Undirected Edges (Friendships) are stored in an Adjacency List using Hash Sets (dict[str, set[str]])
  where each edge (u, v) is recorded symmetrically:
      graph[u].add(v)
      graph[v].add(u)
- Graph Space Complexity: O(V + E)
"""

import json
import os
from typing import Dict, Set, List, Optional, Tuple


DEFAULT_DATA_FILE = os.path.join(os.path.dirname(__file__), "data", "social_network.json")


class SocialNetworkGraph:
    """
    Undirected Graph with Adjacency List and Hash-based User Directory.
    """

    def __init__(self, data_path: Optional[str] = None):
        self.data_path = data_path or DEFAULT_DATA_FILE
        # Hash table for O(1) user lookup: user_id -> {"id": str, "name": str}
        self.users: Dict[str, Dict[str, str]] = {}
        # Adjacency list: user_id -> set of neighbor user_ids
        self.adj_list: Dict[str, Set[str]] = {}
        self.load_from_file()

    def add_user(self, user_id: str, name: str) -> Dict[str, str]:
        """
        Add a new vertex to the graph.
        Time Complexity: O(1) average.
        Validation:
          - user_id cannot be empty
          - name cannot be empty
          - duplicate user_id must be rejected
        """
        user_id = user_id.strip()
        name = name.strip()

        if not user_id:
            raise ValueError("User ID cannot be empty.")
        if not name:
            raise ValueError("User Name cannot be empty.")
        if user_id in self.users:
            raise ValueError(f"User ID '{user_id}' already exists. User IDs must be unique.")

        user_data = {"id": user_id, "name": name}
        self.users[user_id] = user_data
        self.adj_list[user_id] = set()

        self.save_to_file()
        return user_data

    def remove_user(self, user_id: str) -> Dict[str, str]:
        """
        Remove a vertex and all its incident edges.
        Time Complexity: O(deg(user_id)) to update neighbors + O(1) removal.
        """
        user_id = user_id.strip()
        if user_id not in self.users:
            raise ValueError(f"User '{user_id}' not found.")

        # Remove edges from all neighbors (undirected graph)
        neighbors = list(self.adj_list.get(user_id, set()))
        for neighbor in neighbors:
            if neighbor in self.adj_list:
                self.adj_list[neighbor].discard(user_id)

        del self.adj_list[user_id]
        removed_user = self.users.pop(user_id)

        self.save_to_file()
        return removed_user

    def add_friendship(self, u1: str, u2: str) -> Tuple[str, str]:
        """
        Add an undirected edge between u1 and u2.
        Time Complexity: O(1) average.
        Validation:
          - Both users must exist
          - A user cannot be friends with themselves
          - Duplicate friendships must be rejected
        """
        u1 = u1.strip()
        u2 = u2.strip()

        if u1 not in self.users:
            raise ValueError(f"User '{u1}' does not exist.")
        if u2 not in self.users:
            raise ValueError(f"User '{u2}' does not exist.")
        if u1 == u2:
            raise ValueError("A user cannot be friends with themselves.")
        if u2 in self.adj_list[u1]:
            raise ValueError(f"Friendship between '{u1}' and '{u2}' already exists.")

        # Symmetrical update for undirected graph
        self.adj_list[u1].add(u2)
        self.adj_list[u2].add(u1)

        self.save_to_file()
        return (u1, u2)

    def remove_friendship(self, u1: str, u2: str) -> Tuple[str, str]:
        """
        Remove an undirected edge between u1 and u2.
        Time Complexity: O(1) average.
        """
        u1 = u1.strip()
        u2 = u2.strip()

        if u1 not in self.users or u2 not in self.users:
            raise ValueError("Both users must exist to remove a friendship.")
        if u2 not in self.adj_list.get(u1, set()):
            raise ValueError(f"No friendship exists between '{u1}' and '{u2}'.")

        self.adj_list[u1].discard(u2)
        self.adj_list[u2].discard(u1)

        self.save_to_file()
        return (u1, u2)

    def get_user(self, user_id: str) -> Optional[Dict]:
        """
        Hash-based O(1) user lookup.
        """
        user_id = user_id.strip()
        user = self.users.get(user_id)
        if not user:
            return None
        friends = sorted(list(self.adj_list.get(user_id, set())))
        return {
            "id": user["id"],
            "name": user["name"],
            "degree": len(friends),
            "friends": friends,
            "friends_details": [self.users[f] for f in friends if f in self.users]
        }

    def get_all_users(self) -> List[Dict]:
        """
        Retrieve all users with their degree and friend list.
        """
        result = []
        for uid in sorted(self.users.keys()):
            friends = sorted(list(self.adj_list.get(uid, set())))
            result.append({
                "id": uid,
                "name": self.users[uid]["name"],
                "degree": len(friends),
                "friends": friends,
                "friends_details": [
                    {"id": f, "name": self.users[f]["name"]}
                    for f in friends if f in self.users
                ]
            })
        return result

    def get_all_friendships(self) -> List[Dict]:
        """
        Retrieve unique undirected edges.
        """
        seen = set()
        edges = []
        for u1, neighbors in self.adj_list.items():
            for u2 in neighbors:
                pair = tuple(sorted([u1, u2]))
                if pair not in seen:
                    seen.add(pair)
                    edges.append({
                        "source": pair[0],
                        "target": pair[1],
                        "source_name": self.users.get(pair[0], {}).get("name", pair[0]),
                        "target_name": self.users.get(pair[1], {}).get("name", pair[1])
                    })
        return sorted(edges, key=lambda e: (e["source"], e["target"]))

    def get_adjacency_list_dict(self) -> Dict[str, List[str]]:
        """
        Export serializable adjacency list representation.
        """
        return {
            uid: sorted(list(neighbors))
            for uid, neighbors in sorted(self.adj_list.items())
        }

    def get_stats(self) -> Dict:
        """
        Compute standard graph metrics.
        - Vertices V
        - Edges E
        - Graph Density = 2E / (V * (V - 1)) for undirected simple graph
        - Average Degree = 2E / V
        """
        v = len(self.users)
        edges = self.get_all_friendships()
        e = len(edges)
        density = (2.0 * e) / (v * (v - 1)) if v > 1 else 0.0
        avg_degree = (2.0 * e) / v if v > 0 else 0.0

        return {
            "num_users": v,
            "num_friendships": e,
            "density": round(density, 4),
            "density_percentage": round(density * 100, 2),
            "average_degree": round(avg_degree, 2),
            "max_possible_edges": (v * (v - 1)) // 2 if v > 1 else 0
        }

    def save_to_file(self):
        """
        Persist current graph state to JSON file.
        """
        os.makedirs(os.path.dirname(self.data_path), exist_ok=True)
        users_list = [
            {"id": uid, "name": self.users[uid]["name"]}
            for uid in sorted(self.users.keys())
        ]
        edges_list = [
            [edge["source"], edge["target"]]
            for edge in self.get_all_friendships()
        ]
        data = {
            "users": users_list,
            "friendships": edges_list
        }
        with open(self.data_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

    def load_from_file(self):
        """
        Load graph state from JSON file or initialize empty.
        """
        self.users = {}
        self.adj_list = {}

        if not os.path.exists(self.data_path):
            self.reset_to_default()
            return

        try:
            with open(self.data_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            for u in data.get("users", []):
                uid = u["id"].strip()
                name = u["name"].strip()
                self.users[uid] = {"id": uid, "name": name}
                self.adj_list[uid] = set()

            for edge in data.get("friendships", []):
                if len(edge) == 2:
                    u1, u2 = edge[0].strip(), edge[1].strip()
                    if u1 in self.users and u2 in self.users and u1 != u2:
                        self.adj_list[u1].add(u2)
                        self.adj_list[u2].add(u1)
        except Exception:
            self.reset_to_default()

    def reset_to_default(self):
        """
        Reset graph to canonical DAA sample network:
        9 users, 9 edges, 3 connected components.
        """
        sample_users = [
            {"id": "u01", "name": "Aarav"},
            {"id": "u02", "name": "Diya"},
            {"id": "u03", "name": "Kabir"},
            {"id": "u04", "name": "Meera"},
            {"id": "u05", "name": "Ishaan"},
            {"id": "u06", "name": "Anaya"},
            {"id": "u07", "name": "Rohan"},
            {"id": "u08", "name": "Sara"},
            {"id": "u09", "name": "Vivaan"}
        ]
        sample_friendships = [
            ["u01", "u02"],
            ["u01", "u03"],
            ["u02", "u03"],
            ["u02", "u04"],
            ["u03", "u05"],
            ["u04", "u05"],
            ["u06", "u07"],
            ["u06", "u08"],
            ["u07", "u08"]
        ]

        self.users = {u["id"]: u for u in sample_users}
        self.adj_list = {u["id"]: set() for u in sample_users}

        for u1, u2 in sample_friendships:
            self.adj_list[u1].add(u2)
            self.adj_list[u2].add(u1)

        self.save_to_file()
