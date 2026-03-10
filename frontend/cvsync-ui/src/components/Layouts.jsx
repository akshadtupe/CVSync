import CardNav from "./CardNav";


function Layouts({ children }) {

  const items = [
    {
      label: "Jobs",
      bgColor: "#D5B893",
      textColor: "#000000",
      links: [
        { label: "Job Feed", href: "/job-feed" },
        { label: "Applications", href: "/my-applications" }
      ]
    },
    {
      label: "Profile",
      bgColor: "#e5e7eb",
      textColor: "#111",
      links: [
        { label: "My Profile", href: "/profile" }
      ]
    },
    {
      label: "Recruiter",
      bgColor: "#dbeafe",
      textColor: "#111",
      links: [
        { label: "Dashboard", href: "/recruiter" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      <CardNav
        logo={logo}
        items={items}
        baseColor="#ffffff"
        menuColor="#000"
        buttonBgColor="#2563eb"
        buttonTextColor="#fff"
      />

      {/* page content */}
      <main className="max-w-7xl mx-auto pt-32 px-6">
        {children}
      </main>

    </div>
  );
}

export default Layout;