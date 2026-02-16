#!/bin/bash

# LavaGestión - Start all services
# Backend :3001 | Frontend :5173 | Landing :3000

cleanup() {
    echo ""
    echo "Stopping all services..."
    kill $PID_BACKEND $PID_FRONTEND $PID_LANDING 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

DIR="$(cd "$(dirname "$0")" && pwd)"

# Backend
echo "Starting backend on :3001..."
cd "$DIR/backend" && npm run dev &
PID_BACKEND=$!

# Frontend
echo "Starting frontend on :5173..."
cd "$DIR/frontend" && npm run dev &
PID_FRONTEND=$!

# Landing
echo "Starting landing on :3000..."
cd "$DIR/landing" && npx serve . -l 3000 &
PID_LANDING=$!

echo ""
echo "=== LavaGestión running ==="
echo "  Backend:  http://localhost:3001"
echo "  Frontend: http://localhost:5173"
echo "  Landing:  http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all"

wait
