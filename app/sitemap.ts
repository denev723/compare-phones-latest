import { createClient } from "@/lib/supabase/client";
import { MetadataRoute } from "next";

const BASE_URL = "https://your-domain.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();
  const { data: phones } = await supabase.from("phones").select("*");

  if (!phones) throw new Error("No phones found");

  const routes: MetadataRoute.Sitemap = phones.flatMap((primaryPhone) =>
    phones.map((secondaryPhone) => ({
      url: `${BASE_URL}/?primary=${primaryPhone.name}&amp;secondary=${secondaryPhone.name}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }))
  );

  return [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...routes,
  ];
}
