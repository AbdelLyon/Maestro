// UI components
export * from "./components/button";
export * from "./components/toggle";
export * from "./components/toggle-group";
export * from "./components/tabs";
export * from "./components/separator";
export * from "./components/breadcrumb";
export * from "./components/card";
export * from "./components/checkbox";
export * from "./components/dropdown-menu";
export * from "./components/input";
export * from "./components/drawer";
export * from "./components/label";
export * from "./components/select";
export * from "./components/sheet";
export * from "./components/skeleton";
export * from "./components/table";
export * from "./components/textarea";
export * from "./components/tooltip";
export * from "./components/badge";
export * from "./components/sidebar";
export * from "./components/avatar";
export * from "./components/heading";
export * from "./components/themeSwitcher";
export * from "./providers/ThemeProvider";

// sonner (SAFE)
export { Toaster, toast } from "./components/sonner";

// hooks + utils
export * from "./hooks/use-mobile";
export * from "./lib/utils";

// namespaces propres
export * as Icons from "./lib/icons";

// exports nommés (utilisés directement par certaines app pages)
export { Charts, ChartUI } from "./lib/charts";

// types only
export type { ChartConfig } from "./components/chart";
