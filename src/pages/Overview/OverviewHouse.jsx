import React from "react";
import dataHouse from "../../data/Overview_house";
import { Link } from "react-router-dom";
import image1 from "../../assets/img/imgchicken1.svg";
import image2 from "../../assets/img/imgchicken2.svg";
import image3 from "../../assets/img/light.png";

const OverviewHouse = () => {
  const housesWithName = dataHouse.filter((house) => house.houseName);
  const icon = {
    image1,
    image2,
    image3,
  };

  return (
    <div className="p-4">
      <h1 className="text-md md:text-xl lg:text-xl font-bold text-gray-700 dark:text-white mb-6">
        Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {housesWithName.map((house, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 transition hover:shadow-xl"
          >
            {/* House Name */}
            <h2 className="text-sm md:text-md font-semibold text-gray-800 dark:text-white mb-4">
              {house.houseName}
            </h2>

            {/* House Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm md:text-md">
              {house.houseDetail?.map((detail, idx) => {
                const bgColors = ["bg-red-100", "bg-blue-100", "bg-green-100"];
                const hasLink = detail.to; // ตรวจสอบว่ามีลิงก์ไหม
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between lg:flex-col p-4 rounded-lg shadow-sm ${
                      bgColors[idx % bgColors.length]
                    } dark:bg-gray-800`}
                  >
                    <p className="text-gray-600 dark:text-gray-300 font-medium truncate flex items-center gap-2">
                      {hasLink ? (
                        <Link
                          to={detail.to}
                          className="cursor-pointer flex items-center gap-2"
                        >
                          {icon[detail.icon] && (
                            <img
                              src={icon[detail.icon]}
                              alt={detail.label}
                              className="w-8 h-8"
                            />
                          )}
                          {detail.label}
                        </Link>
                      ) : (
                        <span className="flex items-center gap-2">
                          {icon[detail.icon] && (
                            <img
                              src={icon[detail.icon]}
                              alt={detail.label}
                              className="w-8 h-8"
                            />
                          )}
                          {detail.label}
                        </span>
                      )}
                    </p>

                    {detail.value ? (
                      <div className="text-gray-900 dark:text-white text-base font-medium truncate ">
                        {detail.value}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
            </div>

            {/* Card Detail */}
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 mt-6">
              {house.cardDetail.map((card, idx) => (
                <div key={idx} className="w-full">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Feed order and Usage */}
                    {card.silog?.length > 0 && (
                      <div className="flex-1">
                        <h4 className="text-base font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mb-4 text-gray-700 dark:text-white">
                          Feed order and Usage
                        </h4>
                        <div className="grid grid-cols-2">
                          {card.silog.map((silo, sIdx) => (
                            <div
                              key={sIdx}
                              className="bg-white dark:bg-gray-800 p-5 rounded flex flex-col items-center text-center"
                            >
                              <img
                                src={silo.img}
                                alt={silo.siloName}
                                className="w-15 h-30 md:w-20 md:h-35 object-cover rounded-lg mb-4"
                              />
                              <div className="text-xs text-gray-700 dark:text-gray-200">
                                <p className="font-semibold">{silo.siloName}</p>
                                <p>{silo.feedRemainKg} kg</p>
                                <p>({silo.feedRemainPercent})</p>
                              </div>
                            </div>
                          ))}
                          <div className="bg-white dark:bg-gray-800 col-span-2 flex justify-center pb-3 px-4 rounded-b-md">
                            <Link
                              to="/house/feed-order-and-usage"
                              className="bg-blue-500 hover:bg-blue-600 text-white text-xs text-center p-2 w-full rounded-full shadow"
                            >
                              See More
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Birds Live Weight */}
                    {card.ckale?.length > 0 && (
                      <div className="flex-1">
                        <h4 className="text-base font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mb-4 text-gray-700 dark:text-white">
                          Birds Live Weight
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-5">
                          {card.ckale?.map((item, cIdx) => (
                            <div
                              key={cIdx}
                              className="flex flex-col items-start bg-white dark:bg-gray-800 p-5 rounded text-sm text-gray-600 dark:text-gray-300"
                            >
                              <img
                                src={item.img}
                                alt="ckale"
                                className="w-full h-35 object-contain rounded-lg mb-4"
                              />
                              <p>
                                <strong className="text-xs">Weight:</strong>{" "}
                                {item.weight}g ({item.weightRange})
                              </p>
                              <p>
                                <strong className="text-xs">Forecast:</strong>{" "}
                                {item.forcast}
                              </p>
                              <p>
                                <strong className="text-xs">Catching:</strong>{" "}
                                {item.catching}
                              </p>
                              <Link
                                to={item.to}
                                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white text-xs text-center p-2 w-full rounded-full shadow"
                              >
                                See More
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewHouse;
