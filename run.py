#!/usr/bin/env python3
import uvicorn
from app.config import settings

def main():
    print("=" * 65)
    print(f"  🚀 Launching {settings.PROJECT_NAME} v{settings.VERSION}")
    print(f"  🌐 Access the Web UI at: http://localhost:{settings.PORT}")
    print(f"  📄 Interactive API Docs: http://localhost:{settings.PORT}/docs")
    print("=" * 65)
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )

if __name__ == "__main__":
    main()
