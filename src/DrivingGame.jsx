import React, { useRef, useEffect, useState } from 'react';

const DrivingGame = () => {
  const canvasRef = useRef(null);
  const [showPath, setShowPath] = useState(true);

  // We use refs for mutable state that changes inside the animation loop
  // to avoid React state staleness or triggering unnecessary re-renders.
  const waypointsRef = useRef([]);
  const isDrawingRef = useRef(false);
  
  const carRef = useRef({
    x: -100, // Hide off-screen initially
    y: -100,
    length: 20,
    width: 8,
    angle: 0,
    steering: 0,
    speed: 1.5,
    wheelbase: 20,
    currentWaypointIndex: 0,
  });

  // --- Drawing Input Handlers ---
  const getPointerPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e) => {
    isDrawingRef.current = true;
    const pos = getPointerPos(e);
    
    // Start a new track
    waypointsRef.current = [pos];
    
    // Reset the car to the starting point
    carRef.current.x = pos.x;
    carRef.current.y = pos.y;
    carRef.current.angle = 0;
    carRef.current.steering = 0;
    carRef.current.currentWaypointIndex = 0;
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current) return;
    const pos = getPointerPos(e);
    const waypoints = waypointsRef.current;
    const lastPos = waypoints[waypoints.length - 1];

    // Distance threshold: only add a point if we've moved at least 10 pixels.
    // This naturally "smooths" the drawn track so the car doesn't jitter.
    const dx = pos.x - lastPos.x;
    const dy = pos.y - lastPos.y;
    if (Math.sqrt(dx * dx + dy * dy) > 10) {
      waypoints.push(pos);
      
      // Orient the car towards the very first segment immediately
      if (waypoints.length === 2) {
        carRef.current.angle = Math.atan2(dy, dx);
      }
    }
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  // --- Game Loop ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const updateCarPosition = () => {
      const car = carRef.current;
      const waypoints = waypointsRef.current;

      // Don't drive while the user is actively drawing or if no track exists
      if (isDrawingRef.current || waypoints.length <= 1) return;

      // Stop driving if we reached the final waypoint
      if (car.currentWaypointIndex >= waypoints.length - 1) {
        const lastWp = waypoints[waypoints.length - 1];
        const distToEnd = Math.sqrt(Math.pow(lastWp.x - car.x, 2) + Math.pow(lastWp.y - car.y, 2));
        if (distToEnd < 5) return; // Car has arrived
      }

      // 1. Get Target Waypoint
      const currentWaypoint = waypoints[car.currentWaypointIndex];
      const dx = currentWaypoint.x - car.x;
      const dy = currentWaypoint.y - car.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Advance to the next waypoint if we are close enough
      if (dist < 15 && car.currentWaypointIndex < waypoints.length - 1) {
        car.currentWaypointIndex++;
      }

      const target = waypoints[car.currentWaypointIndex];
      const targetAngle = Math.atan2(target.y - car.y, target.x - car.x);

      // 2. Calculate Steering (Normalized Angle Error)
      let angleError = targetAngle - car.angle;
      while (angleError > Math.PI) angleError -= 2 * Math.PI;
      while (angleError < -Math.PI) angleError += 2 * Math.PI;

      // Proportional control for steering
      car.steering = Math.max(-0.8, Math.min(0.8, angleError));

      // 3. Update Pose (Ackermann Model)
      car.x += car.speed * Math.cos(car.angle);
      car.y += car.speed * Math.sin(car.angle);
      car.angle += (car.speed * Math.tan(car.steering)) / car.wheelbase;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const waypoints = waypointsRef.current;
      const car = carRef.current;

      // Draw the custom track
      if (showPath && waypoints.length > 0) {
        // Draw road asphalt
        ctx.strokeStyle = '#586e75';
        ctx.lineWidth = 24; 
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(waypoints[0].x, waypoints[0].y);
        for (let i = 1; i < waypoints.length; i++) {
          ctx.lineTo(waypoints[i].x, waypoints[i].y);
        }
        ctx.stroke();

        // Draw dotted center line
        ctx.strokeStyle = '#93a1a1';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.moveTo(waypoints[0].x, waypoints[0].y);
        for (let i = 1; i < waypoints.length; i++) {
          ctx.lineTo(waypoints[i].x, waypoints[i].y);
        }
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash
      }

      // Draw the car (only if we have drawn at least one point)
      if (waypoints.length > 0) {
        ctx.save();
        ctx.translate(car.x, car.y);
        ctx.rotate(car.angle);
        
        // Car Body
        ctx.fillStyle = 'red';
        ctx.fillRect(-car.length / 2, -car.width / 2, car.length, car.width);

        // Front Left Wheel
        ctx.save();
        ctx.translate(car.length / 2 - 5, -car.width / 2);
        ctx.rotate(car.steering);
        ctx.fillStyle = 'black';
        ctx.fillRect(-2, -1, 4, 2);
        ctx.restore();

        // Front Right Wheel
        ctx.save();
        ctx.translate(car.length / 2 - 5, car.width / 2);
        ctx.rotate(car.steering);
        ctx.fillStyle = 'black';
        ctx.fillRect(-2, -1, 4, 2);
        ctx.restore();
        ctx.restore();
      }

      updateCarPosition();
      animationFrameId = window.requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [showPath]);

  return (
    <div className="mt-2">
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        // touch-none prevents the page from scrolling while drawing on mobile devices
        className="bg-[#073642] border border-[#586e75] touch-none cursor-crosshair"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        title="Click and drag to draw a track"
      />
      <div className="text-xs mt-1 text-[#93a1a1]">
        <strong>Click and drag to draw a custom path!</strong>
        <br />The car will wait until you finish drawing, then follow your track using the Ackermann model.
      </div>
      <button
        onClick={() => setShowPath((prev) => !prev)}
        className="mt-2 text-xs text-[#839496] border border-[#586e75] px-2 py-1 hover:bg-[#586e75] hover:text-white transition-colors"
      >
        {showPath ? 'Hide' : 'Show'} Track
      </button>
    </div>
  );
};

export default DrivingGame;
