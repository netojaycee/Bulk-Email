
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='max-w-8xl mx-auto flex flex-col min-h-screen'>
      <main className='flex-grow'>{children}</main>
    </div>
  );
}
