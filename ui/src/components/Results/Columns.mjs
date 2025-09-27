"use client";

function generateColumns(entries) {
  const keys = [...new Set(entries.flatMap((entry) => Object.keys(entry)))];
  const checkpoints = keys.filter((key) => key.startsWith("checkpoint")).sort();
  const columns = [
    { field: "teamName", headerName: "Team name", width: 200 },
    {
      field: "start",
      headerName: "Start",
      width: 120,
      valueGetter: (_, row) => {
        const date = new Date(row.start);
        return timeStamp(date);
      },
    },
    ...generateCheckpointColumnObjects({ checkpoints }),
    {
      field: "end",
      headerName: "End",
      width: 100,
      valueGetter: (_, row) => {
        const date = new Date(row.end);
        return timeStamp(date);
      },
    },
    {
      field: "time",
      headerName: "Time",
      width: 100,
      valueGetter: (_, row) => {
        const date = new Date(row.time);
        return timeStamp(date);
      },
    },
  ];
  return columns;
}

function generateCheckpointColumnObjects({ checkpoints }) {
  const columns = [];
  if (checkpoints.length === 0) {
    return columns;
  } else {
    columns.push({
      field: `start-to-${checkpoints[0]}`,
      headerName: `Start to Checkpoint ${checkpoints[0].split("checkpoint")[1]}`,
      width: 205,
      valueGetter: (_, row) => {
        const date = new Date(new Date(row[checkpoints[0]]).valueOf() - new Date(row.start).valueOf());
        return timeStamp(date);
      },
    });
  }

  for (let index = 0; index < checkpoints.length; index++) {
    columns.push({
      field: `${checkpoints[index]}`,
      headerName: `Checkpoint ${checkpoints[index].split("checkpoint")[1]}`,
      width: 160,
      valueGetter: (_, row) => {
        const date = new Date(row[checkpoints[index]]);
        return timeStamp(date);
      },
    });

    if (index === checkpoints.length - 1) {
      columns.push({
        field: `${checkpoints[index]}-to-end`,
        headerName: `Checkpoint ${checkpoints[index].split("checkpoint")[1]} to End`,
        width: 200,
        valueGetter: (_, row) => {
          const date = new Date(new Date(row.end).valueOf() - new Date(row[checkpoints[index]]).valueOf());
          return timeStamp(date);
        },
      });
    } else {
      columns.push({
        field: `${checkpoints[index]}-to-${checkpoints[index + 1]}`,
        headerName: `Checkpoint ${checkpoints[index].split("checkpoint")[1]} to Checkpoint ${checkpoints[index + 1].split("checkpoint")[1]}`,
        width: 230,
        valueGetter: (_, row) => {
          const date = new Date(
            new Date(row[checkpoints[index + 1]]).valueOf() - new Date(row[checkpoints[index]]).valueOf(),
          );
          return timeStamp(date);
        },
      });
    }
  }

  return columns;
}

function timeStamp(date) {
  let hours = date.getHours();
  if (Number.isNaN(hours)) {
    return "";
  } else {
    hours = String(hours).padStart(2, "0");
  }

  let minutes = date.getMinutes();
  if (Number.isNaN(minutes)) {
    return "";
  } else {
    minutes = String(minutes).padStart(2, "0");
  }

  let seconds = date.getSeconds();
  if (Number.isNaN(seconds)) {
    return "";
  } else {
    seconds = String(seconds).padStart(2, "0");
  }

  const timeStamp = `${hours}:${minutes}:${seconds}`;
  return timeStamp;
}

export default generateColumns;
