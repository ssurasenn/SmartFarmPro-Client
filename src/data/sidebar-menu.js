const menuData = [
  {
    title: "menu.overview",
    icon: "FaCrown",
    links: [
      { label: "menu.farm", to: "/overview/farm" },
      { label: "menu.house", to: "/overview/house" }
    ]
  },
  {
    title: "menu.house",
    icon: "FaHome",
    links: [
      { label: "menu.feedUsage", to: "/house/feeds" },
      { label: "menu.liveWeight", to: "/house/weight" },
      { label: "menu.climate", to: "/house/climate" }
    ]
  },
  {
    title: "menu.orders",
    icon: "FaShoppingCart",
    links: [
      { label: "menu.demand", to: "/orders/demand" },
      { label: "menu.settingOrders", to: "/orders/setting" },
      { label: "menu.confirmOrders", to: "/orders/confirm" }
    ]
  },
  {
    title: "menu.analysis",
    icon: "FaChartBar",
    links: [
      { label: "menu.climateHistory", to: "/analysis/climatehistory" },
      { label: "menu.reports", to: "/analysis/reports" },
      { label: "menu.compareData", to: "/analysis/comparedata" }
    ]
  },
  {
    title: "menu.management",
    icon: "FaSlidersH",
    links: [
      { label: "menu.manageFarm", to: "/manage/farm" },
      { label: "menu.manageDevice", to: "/manage/device" },
      { label: "menu.upload", to: "/manage/upload" }
    ]
  },
  {
    title: "menu.setting",
    icon: "IoSettings",
    links: [
      { label: "menu.notification", to: "/settings/notification" },
      { label: "menu.member", to: "/settings/member" }
    ]
  },
  {
    title: "menu.calendar",
    icon: "IoCalendar",
    links: [
      { label: "menu.events", to: "/calendar/events" }
    ]
  }
];

  export default menuData;