export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 relative">
      {/* Background Image */}
      <div className="absolute inset-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src="/elegant-glasses-background-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-white/20" />
      </div>
      <div className="flex w-full flex-col gap-6 z-50 justify-center items-center">
        {children}
      </div>
    </div>
  );
}
