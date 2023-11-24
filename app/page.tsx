import Form from "@/components/ui/form";
import SavedFilter from "@/components/ui/savedFilter"

export default function Home() {
  return (
    <div className="flex flex-col mt-20 w-full ">
      <Form></Form>
      <SavedFilter></SavedFilter>
    </div>
  );
}
