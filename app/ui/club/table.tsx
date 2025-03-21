import { fetchOffers } from "@/app/lib/data";
import { filterOffers } from "@/app/lib/data";
import Image from "next/image";

export default async function OfferTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const offers = await fetchOffers();
  console.log("Fetched Offers:", offers);

  const filteredOffers = filterOffers(offers, query);
  console.log("Filtered Offers:", filteredOffers);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile View */}
          <div className="md:hidden">
            {filteredOffers?.map((offer) => (
              <div
                key={offer.id}
                className="mb-4 w-full rounded-md bg-white p-4 shadow-md"
              >
                <div className="flex gap-4">
                  {/* Large Image */}
                  <Image
                    alt={offer.image_alt || "Offer image"}
                    src={offer.image_url}
                    width={100}
                    height={100}
                    className="rounded-md object-cover"
                  />

                  {/* Offer Details */}
                  <div className="flex-1">
                    <p className="text-lg font-semibold">{offer.supplier}</p>
                    <p className="text-green-600 font-medium">
                      {offer.discount}
                    </p>
                    <p className="text-sm text-gray-600">{offer.description}</p>

                    {/* Button - Ensures proper width */}
                    <button className="mt-2 min-w-[140px] rounded bg-[#F76C6C] px-6 py-2 text-white">
                      Go to deal
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <tbody className="bg-white">
              {filteredOffers?.map((offer) => (
                <tr
                  key={offer.id}
                  className="border-b last-of-type:border-none"
                >
                  <td className="py-4 px-6 w-1/3">
                    {/* Large Image on the Left */}
                    <Image
                      alt={offer.image_alt || "Offer image"}
                      src={offer.image_url}
                      width={150}
                      height={150}
                      className="rounded-md object-cover"
                    />
                  </td>
                  <td className="py-4 px-6 w-2/3">
                    {/* Offer Details */}
                    <p className="text-lg font-semibold">{offer.supplier}</p>
                    <p className="text-green-600 font-medium">
                      {offer.discount}
                    </p>
                    <p className="text-sm text-gray-600">{offer.description}</p>
                  </td>
                  <td className="py-4 px-6 w-[160px] text-right">
                    {/* Button - Fixed width to prevent text wrapping */}
                    <button className="min-w-[140px] rounded bg-[#F76C6C] px-6 py-2 text-white">
                      Go to deal
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
