import { buttonVariants } from "@/components/ui/button";
import { Link } from "lucide-react";

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl"></h1>;
      <Link className={buttonVariants()} href="/admin">
        Open My Admin
      </Link>
    </div>
  );
}
