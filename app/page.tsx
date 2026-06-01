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
import ColorButton from "./_components/color-button";
import { cn } from "@/lib/utils";
import { Cpu, Server } from "lucide-react";
import ShareButton from "./_components/share-button";
import PhoneCardSkeleton from "./_components/phone-card-skeleton";
// import { Metadata } from "next";

type PhoneWithColors = Tables<"phones"> & {
  phone_colors: Tables<"phone_colors">[];
};

type PageSearchParams = Promise<{
  primary?: string;
  secondary?: string;
  primaryColor?: string;
  secondaryColor?: string;
}>;

// export const metadata: Metadata = {
//   title: "I-Phone 비교하기",
//   description: "I-Phone을 비교해 보세요.",
//   twitter: {
//     title: "I-Phone 비교하기",
//     description: "I-Phone을 비교해 보세요.",
//   },
// };

export async function generateMetadata({ searchParams }: { searchParams: PageSearchParams }) {
  const { primary, secondary, primaryColor, secondaryColor } = await searchParams;

  const supabase = await createClient();
  const { data } = await supabase.from("phones").select("*, phone_colors(*)");

  if (!data) throw new Error("No data");

  const primaryPhone = data.find((phone) => phone.name === primary) || data[0];
  const secondaryPhone = data.find((phone) => phone.name === secondary) || data[0];

  const resolvedPrimaryColor = primaryColor || primaryPhone.phone_colors[0].name;
  const resolvedSecondaryColor = secondaryColor || secondaryPhone.phone_colors[0].name;

  return {
    title: `${primaryPhone.name} ${resolvedPrimaryColor}모델과 ${secondaryPhone.name} ${resolvedSecondaryColor} 모델을 비교해 보세요.`,
    description: `${primaryPhone.name}와 ${secondaryPhone.name}을 스마트폰 정보를 비교해 보세요.`,
  };
}

const PhoneCard = ({
  order,
  phones,
  selectedPhoneName,
  selectedColor,
}: {
  order: "primary" | "secondary";
  phones: PhoneWithColors[];
  selectedPhoneName: string;
  selectedColor: string;
}) => {
  const options = phones.map((phone) => ({
    value: phone.name,
    label: `${phone.name} Phone`,
  }));

  const selectedPhone = phones.find((phone) => phone.name === selectedPhoneName);

  if (!selectedPhone) throw new Error("No selected phone");

  return (
    <div className="flex flex-col items-center">
      <Suspense
        fallback={<div className="mb-4 h-10 w-full rounded-md border border-input bg-background" />}
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
          src={`/phones/${selectedPhone.name}-${selectedColor}.png`}
          alt="i14 beige"
          fill
          sizes={"(max-width: 768px) 50vw, 33vw"}
          className="object-contain"
          priority
        />
      </div>
      <div className="flex gap-3 mb-2">
        {selectedPhone.phone_colors.map((color) => (
          <ColorButton
            key={color.id}
            colorName={color.name}
            order={order}
            className={cn(color.name === selectedColor && "border-2 border-blue-500")}
          />
        ))}
      </div>
      <div className="text-xl font-semibold">{selectedColor}</div>
    </div>
  );
};

async function PhonesContent({ searchParams }: { searchParams: PageSearchParams }) {
  const { primary, secondary, primaryColor, secondaryColor } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.from("phones").select("*, phone_colors(*)");

  if (!data) throw new Error("No data");

  const primaryPhone = data.find((phone) => phone.name === primary) || data[0];
  const secondaryPhone = data.find((phone) => phone.name === secondary) || data[0];

  const selectedPrimaryColor = primaryColor || primaryPhone.phone_colors[0].name;
  const selectedSecondaryColor = secondaryColor || secondaryPhone.phone_colors[0].name;

  return (
    <div className="container flex flex-col md:items-center md:w-[720px]">
      <div className="grid grid-cols-2 w-full gap-4 md:gap-24 mt-4 mb-4">
        <Suspense fallback={<PhoneCardSkeleton />}>
          <PhoneCard
            order="primary"
            phones={data}
            selectedPhoneName={primaryPhone.name}
            selectedColor={selectedPrimaryColor}
          />
        </Suspense>
        <Suspense fallback={<PhoneCardSkeleton />}>
          <PhoneCard
            order="secondary"
            phones={data}
            selectedPhoneName={secondaryPhone.name}
            selectedColor={selectedSecondaryColor}
          />
        </Suspense>
      </div>
      <ShareButton className="self-end mb-6">공유하기</ShareButton>
      <Accordion type="single" collapsible className="w-full md:w-[480px] mb-24">
        <AccordionItem value="item-1">
          <AccordionTrigger>요약</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4">
              <p className="text-center font-semibold">{primaryPhone.summary}</p>
              <p className="text-center font-semibold">{secondaryPhone.summary}</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>저장 용량</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-center items-center">
                <Server className="h-5 w-5 mr-2" />
                <p>{primaryPhone.storage}</p>
              </div>
              <div className="flex justify-center items-center">
                <Server className="h-5 w-5 mr-2" />
                <p>{secondaryPhone.storage}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>칩</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-center items-center">
                <Cpu className="h-5 w-5 mr-2" />
                <p>{primaryPhone.chip}</p>
              </div>
              <div className="flex justify-center items-center">
                <Cpu className="h-5 w-5 mr-2" />
                <p>{secondaryPhone.chip}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function Page({ searchParams }: { searchParams: PageSearchParams }) {
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
