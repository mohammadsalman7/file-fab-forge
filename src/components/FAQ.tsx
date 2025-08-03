import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  title: string;
  items: FAQItem[];
}

export const FAQ = ({ title, items }: FAQProps) => {
  return (
    <div className="bg-gradient-glass backdrop-blur-sm border-border/50 rounded-2xl p-8 shadow-glass">
      <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
      <Accordion type="single" collapsible className="w-full">
        {items.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};