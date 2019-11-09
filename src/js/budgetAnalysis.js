/* constants */

let expensesData = JSON.parse(localStorage.getItem("data")),
  expenseCategoriesData = {
    Grocery: { label: "Food: Grocery", color: "#000416" },
    Cafe: { label: "Food: Cafe", color: "#000937" },
    Restaurant: { label: "Food: Restaurant", color: "#000E57" },
    "Other expenses for food": { label: "Food: Other", color: "#001377" },
    Cosmetics: { label: "Utilities: Cosmetics", color: "#004696" },
    "Hygiene products": {
      label: "Utilities: Hygiene products",
      color: "#1764BD"
    },
    "Cleaning products": {
      label: "Utilities: Cleaning products",
      color: "#5C92D1"
    },
    "Other expenses for utilities": {
      label: "Utilities: Other",
      color: "#A2C1E4"
    },
    Clothes: { label: "Shopping: Clothes", color: "#436D00" },
    Accessories: { label: "Shopping: Accessories", color: "#568C00" },
    "Products for home": {
      label: "Shopping: Products for home",
      color: "#69AA00"
    },
    "Other expenses for shopping": {
      label: "Shopping: Other",
      color: "#84B92E"
    },
    Cinema: { label: "Entertaiment: Cinema", color: "#A39800" },
    Concert: { label: "Entertaiment: Concert", color: "#D1C300" },
    "Public entertaiment": {
      label: "Entertaiment: Public entertaiment",
      color: "##FFEE00"
    },
    "Other expenses for entertaiment": {
      label: "Entertaiment: Other",
      color: "#FFF12E"
    },
    "Communal payments": {
      label: "Household expenses: Communal payments",
      color: "#A32300"
    },
    "Hot water": { label: "Household expenses: Hot water", color: "#D12E00" },
    "Cold water": { label: "Household expenses: Cold water", color: "#FF3700" },
    Light: { label: "Household expenses: Light", color: "#FF5B2E" },
    Internet: { label: "Household expenses: Internet", color: "#FF7F5C" },
    Phone: { label: "Household expenses: Phone", color: "#FF9679" },
    Rent: { label: "Household expenses: Rent", color: "#FFAD97" },
    "Other household expenses": {
      label: "Household expenses: Other",
      color: "#FFC4B4"
    },
    Vacation: { label: "Other expenses: Vacation", color: "#380838" },
    Medicine: { label: "Other expenses: Medicine", color: "#480A48" },
    Gifts: { label: "Other expenses: Gifts", color: "#570C57" },
    "Expenses for car": {
      label: "Other expenses: Expenses for car",
      color: "#753875"
    },
    "Other expenses": { label: "Other expenses: Other", color: "#946494" }
  };

/* show charts when DOM will be loaded */

$(document).ready(() => {
  showChartsByAllTime();
  showChartsForNow();
});

/* total at interval */

addEventToDrawChartViaClick("Total");

/* total at interval */

addEventToDrawChartViaClick("TotalGroup");

/* total by categories */

addEventToDrawChartViaClick("Categories");

/* Functions */

function showChartsByAllTime() {
  let typeOfAnalysis = ["Total", "TotalGroup", "Categories"],
    outputData;

  typeOfAnalysis.forEach(type => {
    outputData = findOutputData(expensesData, "", "ByAllTime", type);
    if (type === "Total") {
      generateTotalContainer(outputData);
    } else {
      generateChart(outputData, "ByAllTime", type);
    }
  });
}

function showChartsForNow() {
  let date = new Date(),
    dayNow = moment(date).format("L"),
    yearNow = date.getFullYear(),
    weekNow = yearNow + "-W" + date.getWeek(),
    monthNow = yearNow + "-" + (+date.getMonth() + 1),
    typeOfAnalysis = ["Total", "TotalGroup", "Categories"],
    intervals = ["ByDay", "ByWeek", "ByMonth", "ByYear"],
    intervalsNow = [dayNow, weekNow, monthNow, yearNow],
    outputData;

  for (let i = 0; i < typeOfAnalysis.length; i++) {
    for (let j = 0; j < intervals.length; j++) {
      outputData = findOutputData(
        expensesData,
        intervalsNow[j],
        intervals[j],
        typeOfAnalysis[i]
      );
      if (typeOfAnalysis[i] === "Total") {
        generateTotalContainer(outputData);
      } else {
        generateChart(outputData, intervals[j], typeOfAnalysis[i]);
      }
    }
  }
}

function addEventToDrawChartViaClick(typeOfAnalysis) {
  document
    .getElementById("by" + typeOfAnalysis)
    .addEventListener("click", function(event) {
      let intervals = ["ByAllTime", "ByDay", "ByWeek", "ByMonth", "ByYear"];

      intervals.forEach(interval => {
        let inputInterval, outputData;

        if (
          event.target ===
          document.getElementById("choose" + typeOfAnalysis + interval)
        ) {
          try {
            inputInterval = document.getElementById(
              "valueFor" + typeOfAnalysis + interval
            ).value;
            if (interval === "ByDay") {
              inputInterval = moment(
                document.getElementById("valueFor" + typeOfAnalysis + interval)
                  .value
              ).format("L");
            }
          } catch {
            inputInterval = "";
          }
          outputData = findOutputData(
            expensesData,
            inputInterval,
            interval,
            typeOfAnalysis
          );

          if (typeOfAnalysis === "Total") {
            generateTotalContainer(outputData);
          } else {
            generateChart(outputData, interval, typeOfAnalysis);
          }
          return;
        }
      });
    });
}

function findOutputData(expensesData, inputInterval, interval, typeOfAnalysis) {
  let sortedData = {},
    outputData = {};

  if (inputInterval) {
    sortedData = findDataWithinInputInterval(
      expensesData,
      inputInterval,
      interval
    );
  } else {
    sortedData = expensesData;
  }

  outputData = handleDataByTypeOfAnalysis(sortedData, typeOfAnalysis, interval);
  return outputData;
}

function findDataWithinInputInterval(expensesData, inputInterval, interval) {
  let sortedData = {};

  switch (interval) {
    case "ByDay": {
      sortedData = sortDataByInputDay(expensesData, inputInterval);
      break;
    }
    case "ByWeek": {
      sortedData = sortDataByInputWeek(expensesData, inputInterval);
      break;
    }
    case "ByMonth": {
      sortedData = sortDataByInputMonth(expensesData, inputInterval);
      break;
    }
    case "ByYear": {
      sortedData = sortDataByInputYear(expensesData, inputInterval);
      break;
    }
    default:
      return false;
  }

  return sortedData;
}

function sortDataByInputDay(expensesData, inputInterval) {
  let sortedData = {};
  for (let data in expensesData) {
    if (expensesData[data].expenseDate === inputInterval) {
      sortedData[data] = expensesData[data];
    }
  }
  return sortedData;
}

function sortDataByInputWeek(expensesData, inputInterval) {
  let sortedData = {},
    week = inputInterval.slice(-2),
    year = inputInterval.slice(0, 4),
    mondayInWeek = moment()
      .year(year)
      .week(week)
      .day("Monday"),
    nextDay,
    weekDayNumber = 0,
    expenseDate;

  for (let day = 0; day < 7; day++) {
    nextDay = mondayInWeek.day(weekDayNumber).format("L");
    for (let data in expensesData) {
      expenseDate = expensesData[data].expenseDate;
      if (nextDay === expenseDate) {
        sortedData[data] = expensesData[data];
      }
    }
    weekDayNumber++;
  }

  return sortedData;
}

function sortDataByInputMonth(expensesData, inputInterval) {
  let sortedData = {},
    month = inputInterval.slice(-2),
    inputIntervalFormatted;

  for (let data in expensesData) {
    inputIntervalFormatted = expensesData[data].expenseDate.slice(3, 5);
    if (month === inputIntervalFormatted) {
      sortedData[data] = expensesData[data];
    }
  }

  return sortedData;
}

function sortDataByInputYear(expensesData, inputInterval) {
  let sortedData = {},
    year = +inputInterval,
    inputIntervalFormatted;

  for (let data in expensesData) {
    inputIntervalFormatted = +expensesData[data].expenseDate.slice(6);
    if (year === inputIntervalFormatted) {
      sortedData[data] = expensesData[data];
    }
  }

  return sortedData;
}

function handleDataByTypeOfAnalysis(sortedData, typeOfAnalysis, interval) {
  let dataByTypeOfAnalysis;

  switch (typeOfAnalysis) {
    case "Total":
      dataByTypeOfAnalysis = defineDataByTotal(sortedData, interval);
      break;
    case "TotalGroup":
      dataByTypeOfAnalysis = defineDataByTotalGroup(sortedData, interval);
      break;
    case "Categories":
      dataByTypeOfAnalysis = defineDataByCategories(sortedData);
      break;
    default:
      return false;
  }

  return dataByTypeOfAnalysis;
}

function generateTotalContainer(outputData) {
  let totalContainer =
      '<div class="tab-pane container"><div class="container-fluid mt-1"><div class="row d-flex justify-content-center"><div class="total text-dark lead">' +
      outputData.result +
      "</div></div></div></div>",
    chartContainer = document.getElementById(
      "chartTotal" + outputData.interval
    );

  chartContainer.innerHTML = "";
  chartContainer.insertAdjacentHTML("afterbegin", totalContainer);
  $("#total" + outputData.interval + "Container .total").animate(
    { num: outputData.result - outputData.result * 0.3 },
    {
      duration: 2500,
      step: function(num) {
        this.innerHTML = (num + outputData.result * 0.3).toFixed(2);
      }
    }
  );
}

function defineDataByTotal(sortedData, interval) {
  let result = 0,
    dataForChart = {};

  for (let data in sortedData) {
    result += +sortedData[data].expenseValue;
  }
  result = result.toFixed(2);

  dataForChart.result = result;
  dataForChart.interval = interval;

  return dataForChart;
}

function defineDataByTotalGroup(sortedData, interval) {
  let members = [],
    results = [],
    dataForChart = {};

  for (let data in sortedData) {
    if (!members.includes(sortedData[data].payerName)) {
      members.push(sortedData[data].payerName);
    }
  }

  members.forEach(member => {
    let memberTotal = 0;
    for (let data in sortedData) {
      if (sortedData[data].payerName === member) {
        memberTotal += +sortedData[data].expenseValue;
      }
    }
    results.push(memberTotal.toFixed(2));
  });

  dataForChart.results = results;
  dataForChart.interval = members;

  return dataForChart;
}

function defineDataByCategories(sortedData) {
  let categories = [],
    results = [],
    labels = [],
    colors = [],
    sum,
    dataForChart = {};

  for (let data in sortedData) {
    if (!categories.includes(sortedData[data].categoryOfExpense)) {
      categories.push(sortedData[data].categoryOfExpense);
    }
  }
  for (let category in categories) {
    sum = 0;
    for (let data in sortedData) {
      if (sortedData[data].categoryOfExpense === categories[category]) {
        sum += +sortedData[data].expenseValue;
      }
    }
    results.push(sum.toFixed(2));
    for (let categoriesData in expenseCategoriesData) {
      if (categoriesData === categories[category]) {
        labels.push(expenseCategoriesData[categoriesData].label);
        colors.push(expenseCategoriesData[categoriesData].color);
      }
    }
  }
  dataForChart.results = results;
  dataForChart.labels = labels;
  dataForChart.colors = colors;

  return dataForChart;
}

function generateChart(dataForChart, interval, typeOfAnalysis) {
  let context = document
      .getElementById("chart" + typeOfAnalysis + interval)
      .getContext("2d"),
    type,
    label,
    labels,
    options,
    backgroundColor;

  if (dataForChart.results.length) {
    if (typeOfAnalysis === "Categories") {
      type = "doughnut";
      label = dataForChart.labels;
      labels = dataForChart.labels;
      backgroundColor = dataForChart.colors;
      options = null;
    }
    if (typeOfAnalysis === "TotalGroup") {
      type = "bar";
      label = dataForChart.interval;
      labels = dataForChart.interval;
      backgroundColor = "#17a2b8";
      options = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      };
    }

    new Chart(context, {
      type: type,
      data: {
        labels: labels,
        datasets: [
          {
            label: label,
            data: dataForChart.results,
            backgroundColor: backgroundColor
          }
        ]
      },
      options: options
    });
    showCanvasForChart(typeOfAnalysis, interval);
  } else {
    hideCanvasForChart(typeOfAnalysis, interval);
  }
}

function showCanvasForChart(typeOfAnalysis, interval) {
  document
    .getElementById("noData" + typeOfAnalysis + interval)
    .classList.remove("d-flex");
  document
    .getElementById("noData" + typeOfAnalysis + interval)
    .classList.add("d-none");
  document
    .getElementById("chart" + typeOfAnalysis + interval)
    .classList.remove("d-none");
  document
    .getElementById("chart" + typeOfAnalysis + interval)
    .classList.add("d-flex");
}

function hideCanvasForChart(typeOfAnalysis, interval) {
  document
    .getElementById("chart" + typeOfAnalysis + interval)
    .classList.remove("d-flex");
  document
    .getElementById("chart" + typeOfAnalysis + interval)
    .classList.add("d-none");
  document
    .getElementById("noData" + typeOfAnalysis + interval)
    .classList.remove("d-none");
  document
    .getElementById("noData" + typeOfAnalysis + interval)
    .classList.add("d-flex");
}

// Returns the ISO week of the date

Date.prototype.getWeek = function() {
  var date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
};
