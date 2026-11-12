"""
FastAPI Backend Server for FriendConnect — Social Network Graph Analysis.
Exposes RESTful endpoints for DAA graph algorithms, user management,
friendship management, and analytics.
"""

from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from graph import SocialNetworkGraph
from algorithms import (
    find_mutual_friends,
    recommend_friends,
    bfs_shortest_path,
    dfs_connected_components,
)

app = FastAPI(
    title="FriendConnect API",
    description="Backend API for DAA Social Network Graph Analysis",
    version="1.0.0"
)

# Enable CORS for local React development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize graph singleton
graph = SocialNetworkGraph()


# Pydantic Request Models
class UserCreate(BaseModel):
    id: str = Field(..., description="Unique User ID (e.g. u10)")
    name: str = Field(..., description="User full name")


class FriendshipCreate(BaseModel):
    user1: str = Field(..., description="User ID of first friend")
    user2: str = Field(..., description="User ID of second friend")


# Endpoints

@app.get("/")
def root():
    return {
        "project": "FriendConnect — Social Network Graph Analysis",
        "description": "Educational DAA Graph Application demonstrating Adjacency Lists, Hashing, BFS, DFS, and Set Operations.",
        "status": "online"
    }


@app.get("/api/graph")
def get_graph():
    """
    Returns complete graph snapshot including adjacency list, edges,
    hash-table users, statistics, and DFS communities.
    """
    stats = graph.get_stats()
    communities = dfs_connected_components(graph)
    stats["num_components"] = communities["num_components"]

    return {
        "users": graph.get_all_users(),
        "users_dict": graph.users,
        "adjacency_list": graph.get_adjacency_list_dict(),
        "friendships": graph.get_all_friendships(),
        "stats": stats,
        "communities": communities
    }


@app.get("/api/users")
def list_users():
    """
    Retrieve all vertices with their neighbor degrees and friend lists.
    """
    return {
        "count": len(graph.users),
        "users": graph.get_all_users()
    }


@app.post("/api/users", status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate):
    """
    Add a new user vertex into the graph.
    Demonstrates O(1) hash table insertion and adjacency list initialization.
    """
    try:
        user = graph.add_user(payload.id, payload.name)
        return {
            "message": f"User '{user['name']}' ({user['id']}) created successfully.",
            "user": user
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@app.get("/api/users/{user_id}")
def get_user_by_id(user_id: str):
    """
    Demonstrates Hash-based O(1) average lookup for a user vertex.
    """
    user = graph.get_user(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID '{user_id}' not found in hash table."
        )
    return {
        "user": user,
        "lookup_complexity": "O(1) average hash lookup"
    }


@app.delete("/api/users/{user_id}")
def delete_user(user_id: str):
    """
    Removes user vertex and all incident edges.
    """
    try:
        removed = graph.remove_user(user_id)
        return {
            "message": f"User '{removed['name']}' ({removed['id']}) and all connected friendships removed.",
            "user": removed
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@app.get("/api/friendships")
def list_friendships():
    """
    List all undirected edges in the graph.
    """
    edges = graph.get_all_friendships()
    return {
        "count": len(edges),
        "friendships": edges
    }


@app.post("/api/friendships", status_code=status.HTTP_201_CREATED)
def create_friendship(payload: FriendshipCreate):
    """
    Add an undirected friendship edge (u1, u2).
    Updates graph[u1].add(u2) and graph[u2].add(u1).
    """
    try:
        u1, u2 = graph.add_friendship(payload.user1, payload.user2)
        name1 = graph.users[u1]["name"]
        name2 = graph.users[u2]["name"]
        return {
            "message": f"Undirected friendship created between {name1} ({u1}) and {name2} ({u2}).",
            "edge": [u1, u2]
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@app.delete("/api/friendships")
def delete_friendship(user1: str = Query(...), user2: str = Query(...)):
    """
    Remove an undirected friendship edge.
    """
    try:
        u1, u2 = graph.remove_friendship(user1, user2)
        return {
            "message": f"Friendship between '{u1}' and '{u2}' removed successfully.",
            "edge": [u1, u2]
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@app.get("/api/algorithms/mutual-friends")
def get_mutual_friends_endpoint(
    user_a: str = Query(..., description="First user ID"),
    user_b: str = Query(..., description="Second user ID")
):
    """
    Calculates Friends(A) ∩ Friends(B) via set intersection.
    Time complexity: O(min(deg(A), deg(B))).
    """
    try:
        result = find_mutual_friends(graph, user_a, user_b)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@app.get("/api/algorithms/suggestions")
def get_suggestions_endpoint(
    user_id: str = Query(..., description="Target user ID for suggestions")
):
    """
    Calculates friend recommendations based on common neighbor counts.
    """
    try:
        result = recommend_friends(graph, user_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@app.get("/api/algorithms/shortest-path")
def get_shortest_path_endpoint(
    source: str = Query(..., description="Source user ID"),
    destination: str = Query(..., description="Destination user ID")
):
    """
    Executes BFS using a FIFO queue to find unweighted shortest path with parent mapping.
    Time complexity: O(V + E).
    """
    try:
        result = bfs_shortest_path(graph, source, destination)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@app.get("/api/algorithms/communities")
def get_communities_endpoint():
    """
    Executes DFS using a stack and visited set to compute connected components.
    Time complexity: O(V + E).
    """
    return dfs_connected_components(graph)


@app.post("/api/graph/reset")
def reset_graph():
    """
    Resets the graph to the canonical 9-user sample network.
    """
    graph.reset_to_default()
    stats = graph.get_stats()
    communities = dfs_connected_components(graph)
    stats["num_components"] = communities["num_components"]

    return {
        "message": "Graph successfully reset to default academic sample dataset.",
        "stats": stats
    }


@app.get("/api/algorithms/complexity")
def get_complexity_reference():
    """
    Returns theoretical complexity metrics and analysis for the DAA project.
    """
    return {
        "space_complexity": {
            "overall": "O(V + E)",
            "users_dict": "O(V) hash table",
            "adjacency_list": "O(V + 2E) for undirected hash sets"
        },
        "operations": [
            {
                "operation": "Search User",
                "time_complexity": "O(1) average",
                "worst_case": "O(V) (hash collision)",
                "data_structure": "Hash Map (Python dict)",
                "description": "Direct key hashing resolves to user vertex record in constant time."
            },
            {
                "operation": "Add User",
                "time_complexity": "O(1) average",
                "worst_case": "O(V) (rehashing)",
                "data_structure": "Hash Map + Empty Adjacency Set",
                "description": "Inserts key in user directory and initializes empty set in adjacency list."
            },
            {
                "operation": "Add Friendship",
                "time_complexity": "O(1) average",
                "worst_case": "O(1)",
                "data_structure": "Adjacency List (Hash Sets)",
                "description": "Symmetrically inserts u in adj_list[v] and v in adj_list[u]."
            },
            {
                "operation": "Mutual Friends",
                "time_complexity": "O(min(deg(u), deg(v))) expected",
                "worst_case": "O(min(deg(u), deg(v)))",
                "data_structure": "Set Intersection (Friends(u) ∩ Friends(v))",
                "description": "Iterates through smaller degree neighborhood and checks membership in larger set."
            },
            {
                "operation": "BFS Shortest Path",
                "time_complexity": "O(V + E)",
                "worst_case": "O(V + E)",
                "data_structure": "FIFO Queue (collections.deque) + Parent Hash Map",
                "description": "Level-order traversal discovering minimum edge path between source and target."
            },
            {
                "operation": "DFS Communities (Connected Components)",
                "time_complexity": "O(V + E)",
                "worst_case": "O(V + E)",
                "data_structure": "LIFO Stack + Visited Hash Set",
                "description": "Exhaustive depth exploration discovering all maximal connected subgraphs."
            },
            {
                "operation": "Friend Suggestions",
                "time_complexity": "O(W + C log C) expected",
                "worst_case": "O(V^2 + V log V)",
                "data_structure": "2-Hop Traversal + Frequency Map + Sorting",
                "description": "Inspects 2-hop friends-of-friends, filters direct connections, sorts candidates."
            }
        ]
    }
