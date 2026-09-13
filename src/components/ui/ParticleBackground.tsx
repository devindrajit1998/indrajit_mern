import { useEffect, useRef } from "react";

// Developer code tokens and symbols that float gently in the matrix
const DEV_TOKENS = [
  "{ }",
  "</>",
  "=>",
  "( )",
  "[ ]",
  "&&",
  "||",
  "!==",
  "async",
  "await",
  "const",
  "npm",
  "git",
  "01",
  "10",
  "::",
  "fn()",
  "div",
  "//",
  "import",
  "api",
  ";",
];

const DEV_COLORS = [
  "139, 92, 246",  // Brand purple (#8B5CF6)
  "59, 130, 246",   // Brand blue (#3B82F6)
  "16, 185, 129",  // Emerald code green (#10B981)
  "168, 85, 247",  // Violet (#A855F7)
  "96, 165, 250",   // Light cyan/sky
];

interface DevParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: "symbol" | "node";
  text: string;
  fontSize: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  pulseSpeed: number;
  pulseAngle: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic count based on screen area, capped at ~42 items so it stays feather-light (< 0.5% CPU)
    const totalCount = Math.min(Math.floor((width * height) / 32000), 40);

    const particles: DevParticle[] = Array.from({ length: totalCount }, (_, i) => {
      // 65% code syntax symbols, 35% connected binary/network data nodes
      const isSymbol = i % 3 !== 0;
      const baseAlpha = isSymbol
        ? 0.12 + Math.random() * 0.22
        : 0.18 + Math.random() * 0.28;

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,      // slow ambient drift
        vy: -0.15 - Math.random() * 0.2,       // gentle upward terminal flow
        type: isSymbol ? "symbol" : "node",
        text: DEV_TOKENS[Math.floor(Math.random() * DEV_TOKENS.length)],
        fontSize: 10 + Math.random() * 6,       // 10px - 16px crisp monospace font
        radius: 1.2 + Math.random() * 1.5,
        baseAlpha,
        alpha: baseAlpha,
        pulseSpeed: 0.015 + Math.random() * 0.02,
        pulseAngle: Math.random() * Math.PI * 2,
        color: DEV_COLORS[Math.floor(Math.random() * DEV_COLORS.length)],
        rotation: (Math.random() - 0.5) * 0.4,
        rotationSpeed: (Math.random() - 0.5) * 0.004,
      };
    });

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Pause canvas loop when tab is hidden to eliminate any background CPU usage
    let isTabVisible = true;
    const handleVisibilityChange = () => {
      isTabVisible = document.visibilityState === "visible";
      if (isTabVisible && !animationFrameId) {
        render();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const render = () => {
      if (!isTabVisible) return;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw connecting AST / network lines between nearby data nodes
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        if (p1.type !== "node") continue;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;
          const maxDist = 130;

          if (distSq < maxDist * maxDist) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / maxDist) * 0.12;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${lineAlpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // 2. Draw code symbols and nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Motion & drift
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Gentle breathing pulse
        p.pulseAngle += p.pulseSpeed;
        p.alpha = Math.max(0.04, p.baseAlpha + Math.sin(p.pulseAngle) * 0.1);

        // Continuous wrap
        if (p.y < -30) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 20;
        if (p.x > width + 20) p.x = -30;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === "symbol") {
          // Render floating code token (monospaced syntax styling)
          ctx.font = `600 ${p.fontSize}px "JetBrains Mono", "Fira Code", monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
          ctx.shadowColor = `rgba(${p.color}, 0.5)`;
          ctx.shadowBlur = 6;
          ctx.fillText(p.text, 0, 0);
        } else {
          // Render glowing network node
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
          ctx.shadowColor = `rgba(${p.color}, 0.8)`;
          ctx.shadowBlur = p.radius * 4;
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      style={{ willChange: "transform" }}
    />
  );
}
