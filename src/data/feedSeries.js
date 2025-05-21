const feedSeries = [
    {
      name: "Target",
      type: "line",
      encode: { x: "Day", y: "Target" },
      smooth: true,
      lineStyle: { width: 2 },
    },
    {
      name: "Average",
      type: "line",
      encode: { x: "Day", y: "Average" },
      smooth: true,
      lineStyle: { width: 2 },
    },
    {
      name: "House1",
      type: "line",
      encode: { x: "Day", y: "House1" },
      smooth: true,
      lineStyle: { width: 2 },
    },
  ];
  
  export default feedSeries;
  