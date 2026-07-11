export function GradientBlobs() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Top Left - Purple */}
      <div 
        className="absolute -top-[10%] -left-[10%] w-[40vw] h-[40vw] rounded-full bg-brand-purple blur-[180px] mix-blend-screen opacity-[0.08] animate-blob" 
      />
      {/* Top Right - Blue */}
      <div 
        className="absolute -top-[5%] -right-[10%] w-[35vw] h-[35vw] rounded-full bg-brand-blue blur-[180px] mix-blend-screen opacity-[0.08] animate-blob" 
        style={{ animationDelay: "15s" }}
      />
      {/* Center/Hero - Purple + Blue */}
      <div 
        className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[50vw] h-[30vw] rounded-full bg-gradient-brand blur-[180px] mix-blend-screen opacity-[0.05] animate-blob" 
        style={{ animationDelay: "5s" }}
      />
      {/* Projects - Purple */}
      <div 
        className="absolute top-[60%] -left-[5%] w-[35vw] h-[35vw] rounded-full bg-brand-purple blur-[180px] mix-blend-screen opacity-[0.08] animate-blob" 
        style={{ animationDelay: "20s" }}
      />
      {/* Footer - Blue */}
      <div 
        className="absolute bottom-[0%] -right-[5%] w-[40vw] h-[40vw] rounded-full bg-brand-blue blur-[180px] mix-blend-screen opacity-[0.08] animate-blob" 
        style={{ animationDelay: "10s" }}
      />
    </div>
  );
}
