const calculateDateRange = (period) => {
  const today = new Date();
  const startDate = new Date(today);
  let endDate = new Date(today);

  switch (period) {
    case "day":
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "week":
      startDate.setDate(today.getDate() - today.getDay());
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(today.getDate() + (6 - today.getDay()));
      endDate.setHours(23, 59, 59, 999);
      break;
    case "month":
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    default:
      throw new Error("Invalid period specified.");
  }

  return { startDate, endDate };
};

module.exports = { calculateDateRange };
