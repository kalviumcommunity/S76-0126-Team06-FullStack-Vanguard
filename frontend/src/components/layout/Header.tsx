export function Header() {
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-background px-6 lg:h-[60px]">
            <div className="w-full flex-1">
                <h1 className="text-lg font-semibold md:text-xl">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-secondary" />
            </div>
        </header>
    );
}
