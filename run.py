#!/usr/bin/env python3
import sys
import uvicorn
from app.config import settings

# Force utf-8 stdout encoding on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def main():
    print("=" * 65)
    print(f"  Launching {settings.PROJECT_NAME} v{settings.VERSION}")
    print(f"  Access the Web UI at: http://localhost:{settings.PORT}")
    print(f"  Interactive API Docs: http://localhost:{settings.PORT}/docs")
    print("=" * 65)
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=False
    )

if __name__ == "__main__":
    main()
