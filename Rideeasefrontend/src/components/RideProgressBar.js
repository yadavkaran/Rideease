import React from "react";

const RideProgressBar = ({ rideStatus }) => {
  const stages = ["Ride Confirmed", "Ride Started", "Ride Ended"];

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "20px 0" }}>
      {stages.map((stage, index) => (
        <div>
        <div key={index} style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: index <= rideStatus ? "#32cd32" : "lightgray",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {index + 1}
          </div>
          {index < stages.length - 1 && (
            <div
              style={{
                width: "400px",
                height: "5px",
                backgroundColor: index < rideStatus ? "#32cd32" : "lightgray",
              }}
            ></div>
          )}
          
        </div>
        <div className="label">{stages[index]}</div>
        </div>
      ))}
    </div>
  );
};

export default RideProgressBar;
