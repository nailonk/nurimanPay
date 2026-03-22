import { Menu, Search } from "lucide-react"

function Navbar({ openSidebar }) {
  return (
    <div className="w-full border-b bg-background">

      <div className="flex items-center justify-between px-4 md:px-6 py-4">

        {/* LEFT */}
        <div className="flex items-center gap-3">

          {/* MOBILE MENU */}
          <button
            onClick={openSidebar}
            className="md:hidden text-muted-foreground"
          >
            <Menu />
          </button>

          <h1 className="text-lg md:text-xl font-semibold">
            Dashboard Admin
          </h1>
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex items-center">

          <div className="relative w-[240px] lg:w-[280px]">

            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="text"
              placeholder="Search data..."
              className="
                w-full pl-9 pr-3 py-2
                rounded-md
                bg-muted
                text-sm
                placeholder:text-muted-foreground
                focus:outline-none focus:ring-1 focus:ring-ring
              "
            />
          </div>

        </div>

      </div>
    </div>
  )
}

export default Navbar