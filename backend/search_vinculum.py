import os

search_terms = ["segment", "brain", "nii", "dcm", "mesh"]
workspace = r"c:\Users\dabdi\.gemini\antigravity\scratch\vinculum"

if os.path.exists(workspace):
    for root, dirs, files in os.walk(workspace):
        dirs[:] = [d for d in dirs if d not in ["venv", "node_modules", ".git", "__pycache__"]]
        
        for file in files:
            if file.endswith((".py", ".md", ".json", ".tsx", ".ts", ".js")):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                        for line_num, line in enumerate(f, 1):
                            for term in search_terms:
                                if term.lower() in line.lower():
                                    rel_path = os.path.relpath(filepath, workspace)
                                    print(f"vinculum:{rel_path}:{line_num}: {line.strip()[:100]}")
                                    break
                except Exception as e:
                    pass
else:
    print("Vinculum path does not exist")
