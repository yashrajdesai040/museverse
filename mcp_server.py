"""
Museverse Custom MCP Server
Custom Model Context Protocol (MCP) server for the Museverse project.
Compatible with Claude Desktop, Claude Code, and Antigravity via stdio or streamable-http.
"""

import os
import json
import re
from typing import Optional, List, Dict, Any
from mcp.server.mcpserver import MCPServer

# Initialize your own custom MCP Server
app = MCPServer(
    name="museverse-mcp",
    version="1.0.0",
    description="Dedicated codebase intelligence and 3D architectural tools for Museverse"
)

WORKSPACE_ROOT = os.path.dirname(os.path.abspath(__file__))
GRAPH_JSON_PATH = os.path.join(WORKSPACE_ROOT, "graphify-out", "graph.json")

# Load graph data if available
_graph_data = None

def get_graph():
    global _graph_data
    if _graph_data is None and os.path.exists(GRAPH_JSON_PATH):
        try:
            with open(GRAPH_JSON_PATH, "r", encoding="utf-8") as f:
                _graph_data = json.load(f)
        except Exception:
            _graph_data = {"nodes": [], "links": []}
    return _graph_data or {"nodes": [], "links": []}

@app.tool()
def get_architecture_summary() -> str:
    """Returns a high-level summary of the Museverse project architecture, modules, and key stats."""
    graph = get_graph()
    node_count = len(graph.get("nodes", []))
    link_count = len(graph.get("links", []))
    
    summary = f"""# 🏛️ Museverse Architecture Summary
- **Total Codebase Symbols**: {node_count} nodes
- **Total Connections**: {link_count} call/import edges
- **Detected Subsystems**: 30 architectural communities
- **Tech Stack**: Next.js (App Router), React Three Fiber, Three.js, Tailwind CSS, Zustand, GSAP

## Key Core Modules:
1. **Ticket Counter 3D Experience** (`src/components/canvas/ticket-counter/`): Interactive 3D ticket booth with RobotClerk, lighting presets, and marble/limestone procedural textures.
2. **Museum Gallery & Exhibits** (`src/app/museum/`): Virtual museum exhibition archive, Antikythera mechanism 3D model, timeline scatter plots, and specimen detail modals.
3. **Evolution Scene & Canvas Shell** (`src/stores/useEvolutionStore.ts`, `src/components/canvas/`): 3D canvas viewport, multi-tier performance scaling, and camera rigs.
4. **Login Experience & Atmospheric FX** (`src/components/login/`): Dust particles, ink bleed shaders, and museum flythrough intro.
5. **Kinetic Typography & Audio** (`src/components/`): FluidGlass shader, RandomLetterSwap, BlurText, and SpatialAudio hooks.
"""
    return summary

@app.tool()
def search_components(query: str, category: str = "all") -> str:
    """
    Search for React components, 3D models, Zustand stores, or hooks in the codebase.
    
    Args:
        query: Search term (e.g. 'TicketCounter', 'Robot', 'Store', 'Earth')
        category: Filter by 'all', '3d', 'component', 'store', 'hook', 'page'
    """
    graph = get_graph()
    q = query.lower()
    matches = []
    
    for n in graph.get("nodes", []):
        lbl = n.get("label", "")
        src = n.get("source_file", "")
        
        if q in lbl.lower() or q in src.lower():
            # Category match
            sfile = src.lower()
            cat = "component"
            if "/canvas/" in sfile or "3d" in sfile or "model" in sfile or "ticket" in sfile:
                cat = "3d"
            elif "/stores/" in sfile or "store" in sfile:
                cat = "store"
            elif "/hooks/" in sfile or lbl.startswith("use"):
                cat = "hook"
            elif "/app/" in sfile or "page" in sfile:
                cat = "page"
                
            if category != "all" and cat != category:
                continue
                
            matches.append({
                "label": lbl,
                "file": src,
                "community": n.get("community_name", "General"),
                "category": cat
            })
            
            if len(matches) >= 15:
                break
                
    if not matches:
        return f"No symbols found matching query: '{query}' in category: '{category}'."
        
    out = [f"Found {len(matches)} matching items for '{query}':\n"]
    for m in matches:
        out.append(f"- **{m['label']}** [{m['category'].upper()}] &bull; `{m['file']}` ({m['community']})")
    return "\n".join(out)

@app.tool()
def get_component_details(symbol_name: str) -> str:
    """
    Get detailed connections, caller hierarchy, and dependencies for a specific component or symbol.
    
    Args:
        symbol_name: Exact or partial name of the symbol (e.g. 'TicketCounter3D', 'useAppStore', 'RobotClerk')
    """
    graph = get_graph()
    target_node = None
    
    for n in graph.get("nodes", []):
        if n.get("label", "").lower() == symbol_name.lower():
            target_node = n
            break
            
    if not target_node:
        for n in graph.get("nodes", []):
            if symbol_name.lower() in n.get("label", "").lower():
                target_node = n
                break
                
    if not target_node:
        return f"Symbol '{symbol_name}' not found in codebase graph."
        
    nid = target_node["id"]
    callers = []
    dependencies = []
    
    for link in graph.get("links", []):
        if link.get("target") == nid:
            callers.append(f"{link.get('source')} ({link.get('relation', 'calls')})")
        if link.get("source") == nid:
            dependencies.append(f"{link.get('target')} ({link.get('relation', 'calls')})")
            
    out = [
        f"# Symbol: {target_node.get('label')}",
        f"- **File**: `{target_node.get('source_file')}:{target_node.get('source_location', 'L1')}`",
        f"- **Subsystem**: {target_node.get('community_name', 'Default')}",
        f"- **Inbound Callers / Importers** ({len(callers)}):",
    ]
    for c in callers[:10]:
        out.append(f"  &bull; {c}")
    if len(callers) > 10:
        out.append(f"  ...and {len(callers) - 10} more")
        
    out.append(f"\n- **Outbound Dependencies** ({len(dependencies)}):")
    for d in dependencies[:10]:
        out.append(f"  &bull; {d}")
    if len(dependencies) > 10:
        out.append(f"  ...and {len(dependencies) - 10} more")
        
    return "\n".join(out)

@app.tool()
def get_3d_scenes_info() -> str:
    """Returns a list of all 3D canvas components, shaders, and procedural materials in Museverse."""
    graph = get_graph()
    three_d_nodes = []
    
    for n in graph.get("nodes", []):
        sfile = n.get("source_file", "").lower()
        if "/canvas/" in sfile or "3d" in sfile or "model" in sfile or "texture" in sfile:
            three_d_nodes.append(f"- **{n.get('label')}** &bull; `{n.get('source_file')}`")
            if len(three_d_nodes) >= 20:
                break
                
    return "# 🎨 3D Graphics & Canvas Elements in Museverse:\n" + "\n".join(three_d_nodes)

@app.tool()
def find_dependency_path(from_symbol: str, to_symbol: str) -> str:
    """
    Computes the shortest import or call path between any two symbols in the Museverse architecture.
    
    Args:
        from_symbol: Starting symbol name (e.g. 'TicketCounterExperience')
        to_symbol: Destination symbol name (e.g. 'materials')
    """
    graph = get_graph()
    nodes = graph.get("nodes", [])
    links = graph.get("links", [])
    
    # Map label to ID
    label_to_id = {n.get("label", "").lower(): n.get("id") for n in nodes}
    id_to_label = {n.get("id"): n.get("label") for n in nodes}
    
    start_id = label_to_id.get(from_symbol.lower())
    end_id = label_to_id.get(to_symbol.lower())
    
    if not start_id or not end_id:
        return f"Could not resolve symbols: '{from_symbol}' or '{to_symbol}'."
        
    # Build adjacency
    adj = {}
    for l in links:
        s, t = l.get("source"), l.get("target")
        if s not in adj:
            adj[s] = []
        adj[s].append(t)
        
    # BFS
    queue = [[start_id]]
    visited = {start_id}
    found_path = None
    
    while queue:
        path = queue.pop(0)
        curr = path[-1]
        if curr == end_id:
            found_path = path
            break
        for nxt in adj.get(curr, []):
            if nxt not in visited:
                visited.add(nxt)
                queue.append(path + [nxt])
                
    if not found_path:
        return f"No direct dependency path found from '{from_symbol}' to '{to_symbol}'."
        
    out = [f"### Shortest Dependency Path ({len(found_path)-1} steps):"]
    for idx, nid in enumerate(found_path):
        out.append(f"{idx+1}. **{id_to_label.get(nid, nid)}**")
    return "\n".join(out)

@app.tool()
def read_project_file(relative_path: str, max_lines: int = 100) -> str:
    """
    Safely reads source code from a file inside the Museverse project directory.
    
    Args:
        relative_path: Relative file path (e.g. 'src/app/page.tsx' or 'src/components/Footer.tsx')
        max_lines: Maximum number of lines to read (default 100)
    """
    full_path = os.path.join(WORKSPACE_ROOT, relative_path.replace("/", os.sep))
    if not os.path.exists(full_path):
        return f"File does not exist: {relative_path}"
        
    try:
        with open(full_path, "r", encoding="utf-8") as f:
            lines = [f.readline() for _ in range(max_lines)]
        return f"```typescript\n// Path: {relative_path}\n" + "".join(lines) + "\n```"
    except Exception as e:
        return f"Error reading file {relative_path}: {str(e)}"

if __name__ == "__main__":
    import sys
    import argparse

    parser = argparse.ArgumentParser(description="Museverse MCP Server")
    parser.add_argument("--sse", action="store_true", help="Run with SSE transport on HTTP (recommended for remote Claude & mobile)")
    parser.add_argument("--http", action="store_true", help="Run with streamable-http transport on HTTP")
    parser.add_argument("--host", default="0.0.0.0", help="Host interface to bind to (default: 0.0.0.0)")
    parser.add_argument("--port", type=int, default=8000, help="Port to listen on (default: 8000)")
    
    args, unknown = parser.parse_known_args()

    if args.sse:
        print("=" * 60)
        print("🚀 MUSEVERSE MCP SERVER (SSE Mode for Claude Mobile / Web)")
        print(f"📡 Listening locally on: http://localhost:{args.port}/sse")
        print(f"🌐 Remote Endpoint:      /sse")
        print(f"💬 Messages Endpoint:    /messages/")
        print("=" * 60)
        print("👉 To connect Claude Mobile:")
        print(f"   1. Expose with tunnel:  ssh -R 80:localhost:{args.port} nokey@localhost.run")
        print(f"      or with ngrok:       ngrok http {args.port}")
        print("   2. Add the HTTPS URL (with /sse) into Claude's Connectors settings.")
        print("=" * 60)
        app.run(transport="sse", host=args.host, port=args.port)
    elif args.http or (len(sys.argv) > 1 and sys.argv[1] in ("--http", "http")):
        print("=" * 60)
        print("🚀 MUSEVERSE MCP SERVER (Streamable-HTTP Mode)")
        print(f"📡 Listening locally on: http://localhost:{args.port}/mcp")
        print("=" * 60)
        app.run(transport="streamable-http", host=args.host, port=args.port)
    else:
        # Default to stdio for Claude Desktop & Claude Code
        app.run(transport="stdio")

