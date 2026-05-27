import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PhoneCombobox } from "./_components/combobox";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Tables } from "@/database.types";
import { Suspense } from "react";

const Colors = [
  { name: "beige", class: "bg-[#f5f5dc] hover:bg-[#f5f5dc]/70" },
  { name: "grey", class: "bg-[#e5e7eb] hover:bg-[#e5e7eb]/70" },
  { name: "black", class: "bg-[#1e1e1e] hover:bg-[#1e1e1e]/70" },
];

const PhoneCard = ({
  order,
  phones,
  selectedPhoneName,
}: {
  order: "primary" | "secondary";
  phones: Tables<"phones">[];
  selectedPhoneName: string;
}) => {
  const options = phones.map((phone) => ({
    value: phone.name,
    label: `${phone.name} Phone`,
  }));

  return (
    <div className="flex flex-col items-center">
      <Suspense
        fallback={
          <div className="mb-4 h-10 w-full rounded-md border border-input bg-background" />
        }
      >
        <PhoneCombobox
          className="mb-4"
          order={order}
          options={options}
          selectedValue={selectedPhoneName}
        />
      </Suspense>
      <div className="relative aspect-[6/10] md:aspect-square w-full mb-4">
        <Image
          src="/phones/I-14-beige.png"
          alt="i14 beige"
          fill
          sizes={"50vw"}
          className="object-contain"
          priority
        />
      </div>
      <div className="flex gap-3 mb-2">
        {Colors.map((color, index) => (
          <button
            key={index}
            className={cn("w-6 h-6 rounded-full hover:border-blue-500 hover:border-2", color.class)}
          />
        ))}
      </div>
      <div className="text-xl font-semibold">베이지</div>
    </div>
  );
};

type PageSearchParams = Promise<{
  primary?: string;
  secondary?: string;
}>;

async function PhonesContent({
  searchParams,
}: {
  searchParams: PageSearchParams;
}) {
  const { primary, secondary } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.from("phones").select("*");

  if (!data) throw new Error("No data");

  const selectedPrimaryName = primary || data[0].name;
  const selectedSecondaryName = secondary || data[0].name;

  return (
    <div className="container flex flex-col md:items-center md:w-[720px]">
      <div className="grid grid-cols-2 w-full gap-4 md:gap-24 mt-4 mb-8">
        <PhoneCard order="primary" phones={data} selectedPhoneName={selectedPrimaryName} />
        <PhoneCard order="secondary" phones={data} selectedPhoneName={selectedSecondaryName} />
      </div>
      <Accordion type="single" collapsible className="w-full md:w-[480px] mb-24">
        <AccordionItem value="item-1">
          <AccordionTrigger>요약</AccordionTrigger>
          <AccordionContent>스마트폰 정보를 요약 합니다</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>저장 용량</AccordionTrigger>
          <AccordionContent>스마트폰 저장 용량을 요약 합니다</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>칩</AccordionTrigger>
          <AccordionContent>스마트폰 칩 정보를 요약 합니다</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function Page({
  searchParams,
}: {
  searchParams: PageSearchParams;
}) {
  return (
    <Suspense
      fallback={
        <div className="container flex min-h-screen flex-col items-center justify-center">
          Loading phones...
        </div>
      }
    >
      <PhonesContent searchParams={searchParams} />
    </Suspense>
  );
}

export default Page;
