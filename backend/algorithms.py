"""
DAA Algorithm Implementations for FriendConnect.

Algorithms included:
1. Mutual Friends via Set Intersection:
   - Time Complexity: O(min(deg(A), deg(B)))
   - Space Complexity: O(min(deg(A), deg(B)))

2. Friend Suggestions via Common-Neighbour Ranking:
   - Time Complexity: O(W + C log C), where W = sum(deg(friend)), C = candidates count
   - Space Complexity: O(C)

3. Shortest Path via Breadth-First Search (BFS):
   - Time Complexity: O(V + E)
   - Space Complexity: O(V)
   - Uses FIFO queue (collections.deque) and parent/predecessor dictionary for path reconstruction.

4. Connected Components via Depth-First Search (DFS):
   - Time Complexity: O(V + E)
   - Space Complexity: O(V)
   - Uses an explicit LIFO Stack and visited set to discover graph components.
"""

from collections import deque
from typing import Dict, List, Set, Optional, Tuple, Any
from graph import SocialNetworkGraph


def find_mutual_friends(graph: SocialNetworkGraph, user_a: str, user_b: str) -> Dict[str, Any]:
    """
    Computes the mutual friends between user_a and user_b using set intersection.

    Academic Concept:
      Let Friends(A) be the set of neighbours of A and Friends(B) be the set of neighbours of B.
      Mutual Friends = Friends(A) ∩ Friends(B)

    Time Complexity:
      In Python, set intersection iterates over the smaller set and performs O(1) hash lookups
      in the larger set.
      Time Complexity: O(min(deg(A), deg(B)))
    Space Complexity:
      O(min(deg(A), deg(B))) to store the resulting intersection set.
    """
    user_a = user_a.strip()
    user_b = user_b.strip()

    if user_a not in graph.users:
        raise ValueError(f"User '{user_a}' does not exist.")
    if user_b not in graph.users:
        raise ValueError(f"User '{user_b}' does not exist.")

    set_a = graph.adj_list.get(user_a, set())
    set_b = graph.adj_list.get(user_b, set())

    # Actual dynamic set intersection
    mutual_set = set_a.intersection(set_b)
    sorted_mutual = sorted(list(mutual_set))

    mutual_details = [
        {"id": uid, "name": graph.users[uid]["name"]}
        for uid in sorted_mutual
        if uid in graph.users
    ]

    return {
        "user_a": {"id": user_a, "name": graph.users[user_a]["name"], "degree": len(set_a)},
        "user_b": {"id": user_b, "name": graph.users[user_b]["name"], "degree": len(set_b)},
        "friends_a": sorted(list(set_a)),
        "friends_b": sorted(list(set_b)),
        "mutual_count": len(sorted_mutual),
        "mutual_friends": mutual_details,
        "is_direct_friends": user_b in set_a,
        "algorithm": {
            "name": "Set Intersection",
            "formula": "Friends(A) ∩ Friends(B)",
            "time_complexity": "O(min(deg(A), deg(B)))",
            "space_complexity": "O(min(deg(A), deg(B)))",
            "explanation": (
                f"Iterating through the smaller neighborhood ({min(len(set_a), len(set_b))} elements) "
                f"and verifying membership in the hash set of the larger neighborhood in O(1) time."
            )
        }
    }


def recommend_friends(graph: SocialNetworkGraph, user_id: str) -> Dict[str, Any]:
    """
    Recommends friends using the Common-Neighbour heuristic.

    Academic Concept:
      1. Retrieve direct neighbours N(u).
      2. For each v in N(u), explore neighbours N(v) (friends-of-friends).
      3. Filter out:
         - The source user u itself
         - Already existing direct friends in N(u)
      4. Accumulate common-neighbour counts for each candidate:
         common_count(c) = |N(u) ∩ N(c)|
      5. Rank candidates descending by mutual friend count, then lexicographically.

    Time Complexity:
      O(W + C log C) where:
        - W = sum_{v in N(u)} deg(v) (number of 2-hop edges traversed)
        - C is number of candidates to sort
    Space Complexity:
      O(C) for the candidate frequency hash-map.
    """
    user_id = user_id.strip()
    if user_id not in graph.users:
        raise ValueError(f"User '{user_id}' does not exist.")

    direct_friends = graph.adj_list.get(user_id, set())

    # Map: candidate_id -> list of mutual friend IDs connecting them
    candidate_mutuals: Dict[str, List[str]] = {}

    for friend in direct_friends:
        friend_neighbors = graph.adj_list.get(friend, set())
        for fof in friend_neighbors:
            # Exclude self and already direct friends
            if fof != user_id and fof not in direct_friends:
                if fof not in candidate_mutuals:
                    candidate_mutuals[fof] = []
                candidate_mutuals[fof].append(friend)

    recommendations = []
    for cand_id, mutual_list in candidate_mutuals.items():
        unique_mutuals = sorted(list(set(mutual_list)))
        recommendations.append({
            "id": cand_id,
            "name": graph.users.get(cand_id, {}).get("name", cand_id),
            "mutual_count": len(unique_mutuals),
            "mutual_friends": [
                {"id": m, "name": graph.users[m]["name"]}
                for m in unique_mutuals if m in graph.users
            ]
        })

    # Sort descending by mutual_count, then ascending by name
    recommendations.sort(key=lambda r: (-r["mutual_count"], r["name"]))

    return {
        "user": {"id": user_id, "name": graph.users[user_id]["name"]},
        "direct_friends_count": len(direct_friends),
        "direct_friends": sorted(list(direct_friends)),
        "suggestions_count": len(recommendations),
        "suggestions": recommendations,
        "algorithm": {
            "name": "Common-Neighbour Recommendation",
            "time_complexity": "O(W + C log C)",
            "space_complexity": "O(C)",
            "explanation": (
                "Traversed 2-hop neighbourhood (friends-of-friends), excluded existing friends and self, "
                "aggregated mutual friend intersections, and sorted candidate list."
            )
        }
    }


def bfs_shortest_path(graph: SocialNetworkGraph, source: str, destination: str) -> Dict[str, Any]:
    """
    Finds the shortest path between source and destination using Breadth-First Search (BFS).

    Academic Concept:
      - Uses a First-In-First-Out (FIFO) queue (collections.deque).
      - Explores vertices level-by-level (unweighted shortest path guarantee).
      - Maintains a predecessor/parent hash map to reconstruct the exact path.
      - Maintains a visited set to avoid cycles and redundant visits.

    Time Complexity:
      O(V + E) where V is vertices and E is edges.
    Space Complexity:
      O(V) for the queue, visited set, and parent dictionary.
    """
    source = source.strip()
    destination = destination.strip()

    if source not in graph.users:
        raise ValueError(f"Source user '{source}' does not exist.")
    if destination not in graph.users:
        raise ValueError(f"Destination user '{destination}' does not exist.")

    if source == destination:
        return {
            "connected": True,
            "source": {"id": source, "name": graph.users[source]["name"]},
            "destination": {"id": destination, "name": graph.users[destination]["name"]},
            "distance": 0,
            "path": [source],
            "path_details": [{"id": source, "name": graph.users[source]["name"]}],
            "traversal_order": [source],
            "steps": [{
                "step": 1,
                "current": source,
                "action": "Source is destination (0 distance)",
                "queue_state": [],
                "visited": [source]
            }],
            "algorithm": {
                "name": "Breadth-First Search (BFS)",
                "data_structure": "FIFO Queue + Parent Dictionary",
                "time_complexity": "O(V + E)",
                "space_complexity": "O(V)"
            }
        }

    # FIFO Queue for BFS
    queue: deque = deque([source])
    # Set to record visited vertices
    visited: Set[str] = {source}
    # Predecessor mapping: child -> parent
    parent: Dict[str, Optional[str]] = {source: None}

    traversal_order: List[str] = []
    steps_log: List[Dict[str, Any]] = []
    found = False
    step_num = 1

    steps_log.append({
        "step": step_num,
        "action": f"Initialize BFS queue with source '{source}' ({graph.users[source]['name']})",
        "current": None,
        "queue_state": list(queue),
        "visited": sorted(list(visited))
    })

    while queue:
        current = queue.popleft()
        traversal_order.append(current)
        step_num += 1

        if current == destination:
            found = True
            steps_log.append({
                "step": step_num,
                "action": f"Reached destination '{destination}' ({graph.users[destination]['name']})! Terminating search.",
                "current": current,
                "queue_state": list(queue),
                "visited": sorted(list(visited))
            })
            break

        neighbors = sorted(list(graph.adj_list.get(current, set())))
        discovered_neighbors = []

        for neighbor in neighbors:
            if neighbor not in visited:
                visited.add(neighbor)
                parent[neighbor] = current
                queue.append(neighbor)
                discovered_neighbors.append(neighbor)

        action_desc = (
            f"Dequeued '{current}'. Discovered unvisited neighbors: {discovered_neighbors}"
            if discovered_neighbors else
            f"Dequeued '{current}'. All neighbors already visited."
        )

        steps_log.append({
            "step": step_num,
            "action": action_desc,
            "current": current,
            "discovered": discovered_neighbors,
            "queue_state": list(queue),
            "visited": sorted(list(visited))
        })

    if not found:
        return {
            "connected": False,
            "source": {"id": source, "name": graph.users[source]["name"]},
            "destination": {"id": destination, "name": graph.users[destination]["name"]},
            "distance": None,
            "path": [],
            "path_details": [],
            "traversal_order": traversal_order,
            "steps": steps_log,
            "message": "No connection exists between the selected users.",
            "algorithm": {
                "name": "Breadth-First Search (BFS)",
                "data_structure": "FIFO Queue + Parent Dictionary",
                "time_complexity": "O(V + E)",
                "space_complexity": "O(V)",
                "explanation": "BFS queue emptied without encountering destination vertex. Components are disjoint."
            }
        }

    # Reconstruct path using parent dictionary
    path = []
    curr = destination
    while curr is not None:
        path.append(curr)
        curr = parent.get(curr)
    path.reverse()

    path_details = [
        {"id": uid, "name": graph.users[uid]["name"]}
        for uid in path
    ]

    return {
        "connected": True,
        "source": {"id": source, "name": graph.users[source]["name"]},
        "destination": {"id": destination, "name": graph.users[destination]["name"]},
        "distance": len(path) - 1,  # Number of edges
        "path": path,
        "path_details": path_details,
        "traversal_order": traversal_order,
        "steps": steps_log,
        "algorithm": {
            "name": "Breadth-First Search (BFS)",
            "data_structure": "FIFO Queue (collections.deque) + Parent Dictionary",
            "time_complexity": "O(V + E)",
            "space_complexity": "O(V)",
            "explanation": (
                f"Explored {len(traversal_order)} vertices level-by-level until reaching target. "
                f"Reconstructed shortest path of {len(path) - 1} edge(s) via backpointers."
            )
        }
    }


def dfs_connected_components(graph: SocialNetworkGraph) -> Dict[str, Any]:
    """
    Finds all connected components (communities) in the undirected graph using Depth-First Search (DFS).

    Academic Concept:
      - Iterates through all vertices in the graph.
      - If a vertex has not been visited, it seeds a new connected component.
      - An explicit LIFO stack (or recursion) is used to perform DFS:
          * Pop vertex from stack.
          * Mark visited.
          * Push all unvisited neighbours onto stack.
      - Upon stack exhaustion, the component is complete.

    Time Complexity:
      O(V + E) — every vertex and edge is visited at most once.
    Space Complexity:
      O(V) for the stack, visited set, and component partition list.
    """
    visited: Set[str] = set()
    components: List[Dict[str, Any]] = []
    traversal_traces: List[Dict[str, Any]] = []

    # Deterministic alphabetical ordering of user IDs
    all_user_ids = sorted(graph.users.keys())

    for root_id in all_user_ids:
        if root_id not in visited:
            component_nodes: List[str] = []
            stack: List[str] = [root_id]
            component_trace = []

            while stack:
                curr = stack.pop()
                if curr not in visited:
                    visited.add(curr)
                    component_nodes.append(curr)
                    component_trace.append(curr)

                    # Sort neighbors in reverse order so smaller IDs are popped first
                    neighbors = sorted(list(graph.adj_list.get(curr, set())), reverse=True)
                    for neighbor in neighbors:
                        if neighbor not in visited:
                            stack.append(neighbor)

            # Sort component nodes for clean display
            component_nodes.sort()
            comp_id = len(components) + 1

            # Calculate internal edges of this component
            internal_edges = []
            comp_set = set(component_nodes)
            for u in component_nodes:
                for v in graph.adj_list.get(u, set()):
                    if v in comp_set and u < v:
                        internal_edges.append([u, v])

            components.append({
                "community_id": comp_id,
                "name": f"Community {comp_id}",
                "size": len(component_nodes),
                "edge_count": len(internal_edges),
                "members": component_nodes,
                "member_details": [
                    {
                        "id": uid,
                        "name": graph.users[uid]["name"],
                        "degree": len(graph.adj_list.get(uid, set()))
                    }
                    for uid in component_nodes
                ],
                "traversal_trace": component_trace
            })

    # Color palette for component visualization
    component_colors = [
        {"bg": "#3B82F6", "name": "Blue", "badge": "bg-blue-500/10 text-blue-400 border-blue-500/30"},
        {"bg": "#10B981", "name": "Green", "badge": "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"},
        {"bg": "#F59E0B", "name": "Amber", "badge": "bg-amber-500/10 text-amber-400 border-amber-500/30"},
        {"bg": "#EC4899", "name": "Pink", "badge": "bg-pink-500/10 text-pink-400 border-pink-500/30"},
        {"bg": "#8B5CF6", "name": "Purple", "badge": "bg-purple-500/10 text-purple-400 border-purple-500/30"},
        {"bg": "#06B6D4", "name": "Cyan", "badge": "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"},
    ]

    for idx, comp in enumerate(components):
        color_info = component_colors[idx % len(component_colors)]
        comp["color"] = color_info["bg"]
        comp["color_theme"] = color_info

    # Map user_id -> community_id
    user_community_map = {}
    for comp in components:
        for uid in comp["members"]:
            user_community_map[uid] = {
                "community_id": comp["community_id"],
                "community_name": comp["name"],
                "color": comp["color"]
            }

    return {
        "num_components": len(components),
        "components": components,
        "user_community_map": user_community_map,
        "algorithm": {
            "name": "Depth-First Search (DFS) Connected Component Decomposition",
            "data_structure": "LIFO Stack + Visited Hash Set",
            "time_complexity": "O(V + E)",
            "space_complexity": "O(V)",
            "explanation": (
                "Iterated through vertices. For each unvisited vertex, executed DFS with an explicit stack "
                "to exhaustively uncover the maximal connected subgraph (component)."
            )
        }
    }
