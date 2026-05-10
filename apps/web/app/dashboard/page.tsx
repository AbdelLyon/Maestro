import { AppSidebar } from "@/components/shared/AppSidebar";
import { ChartAreaInteractive } from "@/components/shared/ChartAreaInteractive";
import { DataTable } from "@/components/shared/DataTable";
import { SectionCards } from "@/components/shared/SectionCards";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import data from "./data.json";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <DataTable data={data} />
        </div>
      </div>
    </div>
  );
}
