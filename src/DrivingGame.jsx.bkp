import React, { useRef, useEffect, useState } from 'react';
import { Delaunay } from 'd3-delaunay';

const DrivingGame = () => {
  const canvasRef = useRef(null);
  const [showTriangulation, setShowTriangulation] = useState(true);

  // Track with blue and yellow cones
  const cones = [
    { x: 100, y: 100, color: 'blue' },
    { x: 150, y: 90, color: 'blue' },
    { x: 200, y: 100, color: 'blue' },
    { x: 250, y: 130, color: 'blue' },
    { x: 270, y: 180, color: 'blue' },
    { x: 250, y: 230, color: 'blue' },
    { x: 200, y: 250, color: 'blue' },
    { x: 150, y: 230, color: 'blue' },
    { x: 120, y: 180, color: 'blue' },
    { x: 80, y: 80, color: 'yellow' },
    { x: 150, y: 60, color: 'yellow' },
    { x: 220, y: 80, color: 'yellow' },
    { x: 280, y: 130, color: 'yellow' },
    { x: 300, y: 180, color: 'yellow' },
    { x: 280, y: 250, color: 'yellow' },
    { x: 200, y: 280, color: 'yellow' },
    { x: 130, y: 250, color: 'yellow' },
    { x: 90, y: 180, color: 'yellow' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Car parameters
    const car = {
      x: 150,
      y: 150,
      length: 20,
      width: 8,
      angle: 0,
      steering: 0,
      speed: 1.0,
      wheelbase: 20,
      currentWaypointIndex: 0, // Track current target waypoint
    };

    // Handle clicks on canvas to respawn the car
    const handleCanvasClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Set car position to click position
      car.x = x;
      car.y = y;
      
      // Reset car state
      car.angle = 0;
      car.steering = 0;
      
      // Find closest waypoint to set as target
      if (waypoints.length > 0) {
        let closestIndex = 0;
        let closestDist = Infinity;
        
        waypoints.forEach((wp, index) => {
          const dx = wp.x - x;
          const dy = wp.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < closestDist) {
            closestDist = dist;
            closestIndex = index;
          }
        });
        
        car.currentWaypointIndex = closestIndex;
      }
    };
    
    // Add click event listener
    canvas.addEventListener('click', handleCanvasClick);

    // Build Delaunay from cone coordinates
    const points = cones.map(({ x, y }) => [x, y]);
    const delaunay = Delaunay.from(points);
    const triangles = delaunay.triangles;

    // Collect midpoints for edges that connect different-color cones
	const waypoints = [];
	for (let i = 0; i < triangles.length; i += 3) {
	  // Indices in 'points' (and in 'cones')
	  const iA = triangles[i];
	  const iB = triangles[i + 1];
	  const iC = triangles[i + 2];

	  // We'll examine edges (A,B), (B,C), (C,A)
	  const edges = [
		[iA, iB],
		[iB, iC],
		[iC, iA],
	  ];

	  edges.forEach(([idx1, idx2]) => {
		const c1 = cones[idx1];
		const c2 = cones[idx2];
		// Only keep edge if they have different colors
		if (c1.color !== c2.color) {
		  // Compute midpoint
		  const mx = (c1.x + c2.x) / 2;
		  const my = (c1.y + c2.y) / 2;
		  waypoints.push({ x: mx, y: my });
		}
	  });
	}
	
	// Reorder waypoints to form a continuous path
	if (waypoints.length > 1) {
	  const orderedWaypoints = [waypoints[0]]; // Start with first waypoint
	  const unvisited = waypoints.slice(1);    // Remaining waypoints
	  
	  while (unvisited.length > 0) {
		const current = orderedWaypoints[orderedWaypoints.length - 1];
		let closestIdx = 0;
		let closestDist = Infinity;
		
		// Find closest unvisited waypoint
		for (let i = 0; i < unvisited.length; i++) {
		  const dx = current.x - unvisited[i].x;
		  const dy = current.y - unvisited[i].y;
		  const dist = Math.sqrt(dx * dx + dy * dy);
		  
		  if (dist < closestDist) {
			closestDist = dist;
			closestIdx = i;
		  }
		}
		
		// Add closest waypoint and remove from unvisited
		orderedWaypoints.push(unvisited[closestIdx]);
		unvisited.splice(closestIdx, 1);
	  }
	  
	  // Replace original waypoints with ordered ones
	  waypoints.length = 0;
	  waypoints.push(...orderedWaypoints);
	}
    
    // Path planning - modified to follow sequential waypoints
    const updateTargetWaypoint = () => {
      if (waypoints.length === 0) return { x: car.x, y: car.y }; // fallback
      
      const currentWaypoint = waypoints[car.currentWaypointIndex];
      
      // Calculate distance to current waypoint
      const dx = currentWaypoint.x - car.x;
      const dy = currentWaypoint.y - car.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // If car is close enough to current waypoint, move to next one
      if (dist < 15) { // Threshold distance for considering waypoint reached
        car.currentWaypointIndex = (car.currentWaypointIndex + 1) % waypoints.length;
      }
      
      return waypoints[car.currentWaypointIndex];
    };

    // Ackermann steering model update
    const updateCarPosition = () => {
      const target = updateTargetWaypoint();
      const dx = target.x - car.x;
      const dy = target.y - car.y;
      const targetAngle = Math.atan2(dy, dx);

      // Normalize angle error in (-π, π)
      let angleError = targetAngle - car.angle;
      while (angleError > Math.PI) angleError -= 2 * Math.PI;
      while (angleError < -Math.PI) angleError += 2 * Math.PI;

      // Simple proportional control
      car.steering = Math.max(-0.8, Math.min(0.8, angleError));

      // Update car pose
      car.x += car.speed * Math.cos(car.angle);
      car.y += car.speed * Math.sin(car.angle);
      car.angle += (car.speed * Math.tan(car.steering)) / car.wheelbase;
    };

    // Main draw loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw cones
      cones.forEach(({ x, y, color }) => {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });

      // Draw Delaunay triangulation if toggled on
      if (showTriangulation) {
        ctx.strokeStyle = '#586e75';
        for (let i = 0; i < triangles.length; i += 3) {
          const a = points[triangles[i]];
          const b = points[triangles[i + 1]];
          const c = points[triangles[i + 2]];

          ctx.beginPath();
          ctx.moveTo(a[0], a[1]);
          ctx.lineTo(b[0], b[1]);
          ctx.lineTo(c[0], c[1]);
          ctx.closePath();
          ctx.stroke();
        }

        // Draw waypoints in lime with position numbers
        ctx.fillStyle = 'lime';
        waypoints.forEach((wp, index) => {
          // Draw waypoint dot
          ctx.beginPath();
          ctx.arc(wp.x, wp.y, 3, 0, 2 * Math.PI);
          ctx.fill();
          
        //   // Draw waypoint number
        //   ctx.fillStyle = 'white';
        //   ctx.font = '10px Arial';
        //   ctx.textAlign = 'center';
        //   ctx.textBaseline = 'middle';
        //   ctx.fillText(index.toString(), wp.x, wp.y - 10);
          
          // Highlight current target waypoint
          if (index === car.currentWaypointIndex) {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(wp.x, wp.y, 6, 0, 2 * Math.PI);
            ctx.stroke();
          }
          
          ctx.fillStyle = 'lime';
        });
      }

      // Draw car
      ctx.save();
      ctx.translate(car.x, car.y);
      ctx.rotate(car.angle);
      ctx.fillStyle = 'red';
      ctx.fillRect(-car.length / 2, -car.width / 2, car.length, car.width);

      // Front wheels
      ctx.save();
      ctx.translate(car.length / 2 - 5, -car.width / 2);
      ctx.rotate(car.steering);
      ctx.fillStyle = 'black';
      ctx.fillRect(-2, -1, 4, 2);
      ctx.restore();

      ctx.save();
      ctx.translate(car.length / 2 - 5, car.width / 2);
      ctx.rotate(car.steering);
      ctx.fillStyle = 'black';
      ctx.fillRect(-2, -1, 4, 2);
      ctx.restore();
      ctx.restore();

      // Update car
      updateCarPosition();
      animationFrameId = window.requestAnimationFrame(draw);
    };

    draw();
    
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('click', handleCanvasClick);
    };
    // eslint-disable-next-line
  }, [showTriangulation]);

  return (
    <div className="mt-2">
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="bg-[#073642] border border-[#586e75]"
        title="Click anywhere to spawn the car at that position"
      />
      <div className="text-xs mt-1 text-[#93a1a1]">
        This is a pretty basic example of autonomous car navigating using Ackermann steering model
        <br />Yellow cones: outer track | Blue cones: inner track
        <br /><strong>Click anywhere on the track to spawn the car at that position</strong>
      </div>
      <button
        onClick={() => setShowTriangulation((prev) => !prev)}
        className="mt-2 text-xs text-[#839496] border border-[#586e75] px-2 py-1"
      >
        {showTriangulation ? 'Hide' : 'Show'} Triangulation
      </button>
    </div>
  );
};

export default DrivingGame;
