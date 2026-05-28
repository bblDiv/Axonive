import os

search_terms = ["60", "61"]
workspace = r"c:\Users\dabdi\.gemini\antigravity\scratch\axonive"

for root, dirs, files in os.walk(workspace):
    # Exclude venv, node_modules, and git directories
    dirs[:] = [d for d in dirs if d not in ["venv", "node_modules", ".git", "__pycache__"]]
    
    for file in files:
        if file.endswith((".py", ".md", ".json", ".tsx", ".ts")):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                    for line_num, line in enumerate(f, 1):
                        for term in search_terms:
                            if term in line:
                                rel_path = os.path.relpath(filepath, workspace)
                                print(f"{rel_path}:{line_num}: {line.strip()}")
            except Exception as e:
                pass
