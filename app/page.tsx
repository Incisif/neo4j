import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
      <div className="mt-4 max-w-lg m-auto">
      <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
          <AccordionTrigger>where is it accessible?</AccordionTrigger>
                    <AccordionContent>
                      From here :smilley
                    </AccordionContent>
        </AccordionItem>
      </Accordion>


     </div>
    )
}
